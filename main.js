document.getElementsByName("submit")[0].addEventListener("click", function() {
    dose1 = document.getElementsByName("dose1")[0].value;
    dose2 = document.getElementsByName("dose2")[0].value;
    dose3 = document.getElementsByName("dose3")[0].value;
    dose4 = document.getElementsByName("dose4")[0].value;
    dose5 = document.getElementsByName("dose5")[0].value;
    inr1 = document.getElementsByName("inr1")[0].value;
    inr2 = document.getElementsByName("inr2")[0].value;
    inr3 = document.getElementsByName("inr3")[0].value;
    inr4 = document.getElementsByName("inr4")[0].value;
    inr5 = document.getElementsByName("inr5")[0].value;
    split2 = Number(document.getElementsByName("split2")[0].checked);
    split3 = Number(document.getElementsByName("split3")[0].checked);
    split4 = Number(document.getElementsByName("split4")[0].checked);
    split5 = Number(document.getElementsByName("split5")[0].checked);

    var doses = [];
    if (dose1 != "") {
        doses.push(Number(dose1));
        if (dose2 != "") {
            doses.push(Number(dose2));
            if (dose3 != "") {
                doses.push(Number(dose3));
                if (dose4 != "") {
                    doses.push(Number(dose4));
                    if (dose5 != "") doses.push(Number(dose5));
                }
            }
        }
    }
    var inrs = [];
    if (inr1 != "") {
        inrs.push(Number(inr1));
        if (inr2 != "") {
            inrs.push(Number(inr2));
            if (inr3 != "") {
                inrs.push(Number(inr3));
                if (inr4 != "") {
                    inrs.push(Number(inr4));
                    if (inr5 != "") inrs.push(Number(inr5));
                }
            }
        }
    }
    var splits = [split2, split3, split4, split5];
    var data = {"dose": doses, "inr": inrs, "split": splits};
    var xhr = new XMLHttpRequest();   // new HttpRequest instance
    var theUrl = "/predict";
    xhr.open("POST", theUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            document.getElementById("predictedAction").textContent = response.recommendation;
        }
    };
    xhr.send(JSON.stringify(data));

    console.log(data);
});
