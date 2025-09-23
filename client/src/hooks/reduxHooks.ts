import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";

// Typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import {} from "react-redux";

// Custom useDispatch hook with correct typing
export const useAppDispatch = () => useDispatch<AppDispatch>();
