import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { errorsReducer as errors } from './errors';
import { sessionReducer as session } from './session';

const reducer = combineReducers({
    errors,
    session,
});

export { errorsActions } from './errors';
export { sessionActions } from './session';

export default configureStore({
  reducer
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(throttleMiddleware),
});
