# Warfarin dosing policy website

This is a simple Flask application which exposes the learned warfarin policy
from our [research](https://github.com/hamilton-health-sciences/warfarin) as
a human-usable web form. We created it to give researchers the ability to
interrogate the dosing algorithm. It is hosted [here](https://warfarin.herokuapp.com)
on Heroku.

## Model weights

This repository also provides the final policy neural network weights and
learned data preprocessors, which could facilitate large-scale validation on
external data. For example, you could clone this repository (which contains the
model weights in `model.pt` and a wrapper in `model.py`) and do:

    >>> from model import predict
    >>> predict(inrs=[3.], warfarin_doses=[25.], traj_split_since=[])
    3

## Running the website locally

Install the requirements under (tested under Python 3.9):

    $ python3 -m pip install -r requirements.txt

Launch the app:

    $ gunicorn web:app

## See also

* Our [research repository](https://github.com/hamilton-health-sciences/warfarin)
