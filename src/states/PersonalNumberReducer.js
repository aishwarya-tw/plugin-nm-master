const ACTION_SAVE_PERSONAL_NUMBER = 'SAVE_PERSONAL_NUMBER';

const initialState = {
  phoneNumber: "",
};

export class Actions {
  static savePersonalNumber = (phoneNumber) => ({
    type: ACTION_SAVE_PERSONAL_NUMBER,
    phoneNumber,
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SAVE_PERSONAL_NUMBER: {
      return {
        ...state,
        phoneNumber: action.phoneNumber,
      };
    }
    default: {
      return state;
    }
  }
}