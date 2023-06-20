import { configureStore } from "@reduxjs/toolkit";
import filter from "./actions/filter";
import loading from "./actions/loading";
import menu from './actions/menu';
import user from "./actions/user";

export default configureStore({
    reducer: {
        menu: menu,
        filter: filter,
        user: user,
        loading: loading
    }
});