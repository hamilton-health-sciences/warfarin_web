import json

import pickle

from flask import Flask, request, send_from_directory

import numpy as np

import torch

from smdbcq import SMDBCQ


# Load the learned transforms and policy.
transforms = pickle.load(open("transforms.pkl", "rb"))
policy = SMDBCQ(
    num_actions=7,
    state_dim=14,
    device="cpu",
    BCQ_threshold=0.4,
    hidden_states=64,
    num_layers=2
)
state = torch.load("model.pt", map_location="cpu")
policy.q.load_state_dict(state["q"])
policy.q_target.load_state_dict(state["q_target"])

# Text descriptions of each action.
action_dict = {
    0: "Decrease by >20%",
    1: "Decrease by 10-20%",
    2: "Decrease by <10%",
    3: "Maintain",
    4: "Increase by <10%",
    5: "Increase by 10-20%",
    6: "Increase by >20%"
}


def predict(inrs, warfarin_doses, traj_split_since):
    """
    Get the policy decision given a patient history.

    Args:
        inrs: An array of length N. Up to 5 previous INRs.
        warfarin_doses: An array of length N. Up to 5 previous doses. The nth dose
                        should be the warfarin dose prior to recording the nth INR.
        traj_split_since: An array of length 4. Whether the trajectory has been split
                          due to a therapy interruption since the given dose-response
                          pair has been observed.

    Returns:
        action: The integer corresponding to the policy action.
    """
    if len(inrs) != len(warfarin_doses):
        raise ValidationError("Number of INRs must equal the number of doses.")
    if len(inrs) < 5:
        inrs = inrs + [inrs[-1]] * (5 - len(inrs))
        warfarin_doses = warfarin_doses + [warfarin_doses[-1]] * (5 - len(warfarin_doses))
    if len(traj_split_since) < 4:
        traj_split_since = traj_split_since + [0] * (4 - len(traj_split_since))
    min_idx = 4
    for idx, x in enumerate(traj_split_since):
        if x == 1:
            min_idx = idx
    for idx in range(min_idx, 4):
        traj_split_since[idx] = 1

    raw_inrs = np.array(inrs)
    raw_doses = np.array(warfarin_doses)
    indicators = np.array(traj_split_since)

    inr_transformed = transforms["inr_qn"].transform(raw_inrs.reshape(-1, 1))[:, 0]
    dose_transformed = raw_doses * transforms["continuous"].scale_[1]

    state = np.concatenate(([inr_transformed[0]],
                            [dose_transformed[0]],
                            inr_transformed[1:],
                            dose_transformed[1:],
                            indicators))
    action = policy.select_action(torch.from_numpy(state.reshape(1, -1)).float())[0, 0]

    return action
