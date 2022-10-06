document.getElementsByName("submit")[0].addEventListener("click", function() {
    
    // Validation
    let validated = validateInputs();
    if (!validated)
        return;

    form = document.getElementById("caluclator-form")
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
    var data = { "dose": doses, "inr": inrs, "split": splits };
    var xhr = new XMLHttpRequest();   // new HttpRequest instance
    var theUrl = "/predict";
    xhr.open("POST", theUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            document.getElementById("predictedAction").textContent = response.recommendation;
            document.getElementById("predictedActionContainer").classList.remove("visually-hidden")
            window.scrollTo(0, document.body.scrollHeight);
        }
        else if (xhr.status != 200) {
            let errorContainer = document.getElementById('general-error');
            errorContainer.textContent = "An error has occurred connecting to the server.";
            errorContainer.parentElement.scrollIntoView({behavior: "smooth", block: "center"});
        }
    };
    xhr.send(JSON.stringify(data));

    console.log(data);

});

function validateInputs() {
    let inputs = document.querySelectorAll("input[type=number]");

    // Verify that both current inputs are given
    if (inputs[0].value == "" || inputs[1].value == "") {
        let errorContainer = document.getElementById('pair1-error');
        errorContainer.textContent = "Please include a value for both the current warfarin dose and INR.";
        errorContainer.parentElement.scrollIntoView({behavior: "smooth", block: "center"});
        return false; 
    }

    // Create object representation of the form
    let formObject = {};
    let pairNum = 1;
    for (let i = 0; i < inputs.length; i += 2) {
        let entry = { doseVal: inputs[i].value, inrVal: inputs[i + 1].value };
        formObject[`pair${pairNum}`] = entry;
        pairNum++;
    }

    // Verify that the prior therapies were filled out top to bottom
    let inputUsed = false;
    for (let i = Object.keys(formObject).length; i >= 1; i--) {
        let doseVal = formObject[`pair${i}`].doseVal;
        let inrVal = formObject[`pair${i}`].inrVal;
        if ((doseVal == "" && inrVal == "") && inputUsed) {
            let errorContainer = document.getElementById(`pair${i}-error`);
            errorContainer.textContent = "Please fill out prior therapy data from top to bottom.";
            errorContainer.parentElement.scrollIntoView({behavior: "smooth", block: "center"});
            return false;
        }
        else if (doseVal || inrVal)
            inputUsed = true;
    }

    // Verify that each prior therapy's inputs are both empty or both filled
    for (let i = 1; i <= Object.keys(formObject).length; i++) {
        let doseVal = formObject[`pair${i}`].doseVal;
        let inrVal = formObject[`pair${i}`].inrVal;
        // Check if either input has data, and if so verify both were filled
        if ((doseVal || inrVal) && (doseVal == "" || inrVal == "")          ) {        
            let errorContainer = document.getElementById(`pair${i}-error`);
            errorContainer.textContent = "Please include a value for both the warfarin dose and INR.";
            errorContainer.parentElement.scrollIntoView({behavior: "smooth", block: "center"});
            return false;
        }
    }
    
    return true
}

function clearErrors() {
    let errors = document.getElementsByClassName("error");
    for (let error of errors)
        error.textContent = "";
}

function handleReset() {
    clearErrors();
    document.getElementById("predictedActionContainer").classList.add("visually-hidden");
    document.getElementById("predictedAction").textContent = "";
}