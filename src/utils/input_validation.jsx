export const name_validation = {
    name: 'name',
    label: 'name',
    type: 'text',
    id: 'name',
    placeholder: 'Full Name ...',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      maxLength: {
        value: 1000,
        message: '1000 characters max',
      },
    },
  };

  export const phone_validation = {
    name: 'phone',
    label: 'phone number',
    type: 'phone',
    id: 'phone',
    placeholder: 'Phone Number',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      pattern: {
        value: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g,
        message: 'not valid',
      },
    },
  }

  export const otp_validation = {
    name: 'otp',
    label: 'otp number',
    type: 'otp',
    id: 'otp',
    placeholder: 'otp Number',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      pattern: {
        value: /^[0-9]{0,6}$/g,
        message: 'Not Valid',
      },
    },
  }
  
  
  export const password_validation = {
    name: 'password',
    label: 'password',
    type: 'password',
    id: 'password',
    placeholder: 'Password ...',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      pattern:{
        value:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}/,
        message:'Must have at least one capital letter and symbol'
      },
      minLength: {
        value: 8,
        message: 'min 8 characters',
      },
    },
  }
  
  export const num_validation = {
    name: 'num',
    label: 'number',
    type: 'number',
    id: 'num',
    placeholder: '',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
    },
  }
  
  export const email_validation = {
    name: 'email',
    label: 'email address',
    type: 'email',
    id: 'email',
    placeholder: 'Email address',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Not valid',
      },
    },
}

export const url_validation = {
    validation: {
        // validate:(value) =>{
        //     try {
        //       new URL(value);
        //       return;
        //     } catch (err) {
        //       return "Invalid Url";
        //     }
            
        // },
        required: {
          value: true,
          message: 'required',
        },
        pattern: {
          // value:/^[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
          value:/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
          message:'not valid'
        },
    },
}


export const desc_validation = {
    name: 'description',
    label: 'description',
    multiline: true,
    id: 'description',
    placeholder: 'write description ...',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      maxLength: {
        value: 10000,
        message: '10000 characters max',
      },
    },
  }
