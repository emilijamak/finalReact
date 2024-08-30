import {create} from "zustand";

const useStore = create((set, get) => ({
    currentUser: null,
    token: "",
    users: [],
    conNum: 0,
    setGrid: val => set({grid: val}),
    setToken: val => set({token: val}),
    setCurrentUser: val => set({currentUser: val}),
    setUsers: val => set({users: val}),
    setConNum: val => set({conNum: val}),
}))

export default useStore