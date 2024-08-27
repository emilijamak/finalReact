import {create} from "zustand";

const useStore = create((set, get) => ({
    currentUser: null,
    token: "",
    users: [],
    setGrid: val => set({grid: val}),
    setToken: val => set({token: val}),
    setCurrentUser: val => set({currentUser: val}),
    setUsers: val => set({users: val}),
}))

export default useStore