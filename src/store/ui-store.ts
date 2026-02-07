import { create } from "zustand";

interface UIState {
    isCoursesOpen: boolean;
    isFeedbackOpen: boolean;
    openCourses: () => void;
    closeCourses: () => void;
    openFeedback: () => void;
    closeFeedback: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isCoursesOpen: false,
    isFeedbackOpen: false,
    openCourses: () => set({ isCoursesOpen: true, isFeedbackOpen: false }),
    closeCourses: () => set({ isCoursesOpen: false }),
    openFeedback: () => set({ isFeedbackOpen: true, isCoursesOpen: false }),
    closeFeedback: () => set({ isFeedbackOpen: false }),
}));
