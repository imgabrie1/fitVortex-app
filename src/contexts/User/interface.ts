export interface iContextUserProps {
  children: React.ReactNode;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface iDataRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface iDataLogin {
  email: string;
  password: string;
}

export interface iResponse {
  token: string;
  user: iUserResponse;
}

export interface iUserResponse {
  email: string;
  name: string;
  id: number;
}

export interface iUser extends iUserResponse {
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface iUserContext {
  loading: boolean;
  registerUser: (data: iDataRegister) => Promise<void>;
  login: (data: iDataLogin) => Promise<void>;
  logout: () => void;
  loadingForm: boolean;
}

export interface MicroCycle {
  id: string;
  microCycleName: string;
  createdAt: string | Date;
  trainingDays: number;
  user: iUser;
  volumes?: any;
  notes?: string;
  cycleItems?: CycleItems[];
}

export interface CycleItems {
  microCycle?: MicroCycle;
  id: string;
  position: number;
  createdAt: string | Date;
  workout: Workout;
  sets: Set[];
  isSkipped: boolean
}

export interface Workout {
  id: string;
  name: string;
  workoutExercises: WorkoutExercise[];
  volume: Volume;
  createdAt: string | Date;
}

export interface WorkoutExercise {
  id: string;
  targetSets: number;
  exercise: Exercise;
  is_unilateral?: boolean;
  notes: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  imageURL: string;
  description: string;
  resistanceType: string;
  primaryMuscle: string;
  secondaryMuscle: string[];
  default_unilateral: boolean;
}

export interface ExerciseResponse {
  data: Exercise[];
  page: number;
  lastPage: number;
  total: number;
  limit: number;
}

export interface Set {
  id: string;
  reps: number;
  weight: string;
  side: "both" | "left" | "right";
  exercise: Exercise;
}

export interface Volume {
  id: string;
  entries: VolumeEntry[];
}

export interface VolumeEntry {
  id: string;
  muscleGroup: string;
  volume: number;
  sets: number;
}

export type WorkoutExerciseWithSets = WorkoutExercise & { sets?: Set[] };

export type WorkoutWithSets = Omit<Workout, "workoutExercises" | "createdAt"> & {
  workoutExercises: WorkoutExerciseWithSets[];
  isSkipped: boolean;
  createdAt: string | Date;
};

export interface MacroCycle {
  id: string;
  macroCycleName: string;
  startDate: string;
  endDate: string;
  microQuantity: number;
  microCycles: MicroCycle[]; // Correctly defined as an array of MicroCycle
}

export interface SetInput {
  reps: number;
  weight: number;
}

export interface ExerciseInput {
  exerciseId: string;
  sets: SetInput[];
  notes?: string;
}

export interface RecordWorkoutInput {
  exercises: ExerciseInput[];
}

export interface iCreateMacroCycle {
  macroCycleName: string;
  startDate: Date | string;
  endDate: Date | string;
  microQuantity: number;
}

export interface iCreateMicroCycle {
  microCycleName: string;
  trainingDays: number;
}

export interface ExerciseTarget {
  exerciseId: string;
  targetSets: number;
  is_unilateral: boolean;
}

export interface ExerciseInCreateAndPatch {
  exercises: ExerciseTarget[];
}

export interface iCreateWorkout {
  name: string;
  exercises: ExerciseInCreateAndPatch["exercises"];
}

export type iPatchWorkout = Partial<iCreateWorkout>;

export interface newMacroWithAI {
  prompt: string | null;
  createNewWorkout: boolean;
}

export interface WorkoutResponse {
  data: WorkoutWithSets[];
  page: number;
  lastPage: number;
  total: number;
  limit: number;
}

export type UserContextData = {
  token: string | null;
  user: iUserResponse | null;
  volumes: number;
  refreshWorkoutsData?: () => Promise<void>;
  loading: boolean;
  loadingForm: boolean;
  login: (creds: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: iDataRegister) => Promise<void>;
  getAllWorkouts: (page?: number, limit?: number) => Promise<WorkoutResponse>;
  getAllMacroCycles: () => Promise<MacroCycle[]>;
  getAllMicroCycles: () => Promise<MicroCycle[]>;
  getMacroCycleByID: (macroID: string) => Promise<MacroCycle>;
  getMicroCycleByID: (microID: string) => Promise<any>;
  saveWorkout: (
    microID: string,
    workoutID: string,
    workoutData: any,
    isEdit: boolean
  ) => Promise<any>;
  createMacroCycle: (payload: any) => Promise<iCreateMacroCycle>;
  createMicroCycle: (payload: any) => Promise<MicroCycle>;
  addMicroInMacro: (macroID: string, microID: string) => Promise<any>;
  deleteCycles: (cycle: string, cycleID: string) => Promise<void>;
  getAllExercise: (
    page?: number,
    limit?: number,
    filters?: string
  ) => Promise<ExerciseResponse>;
  createWorkout: (payload: iCreateWorkout) => Promise<any>;
  addWorkoutInMicro: (microID: string, workoutID: string) => Promise<any>;
  updateWorkoutOrder: (
    microCycleID: string,
    orderedIds: string[]
  ) => Promise<void>;
  addExerciseInWorkout: (
    payload: ExerciseInCreateAndPatch,
    workoutID: string
  ) => Promise<any>;
  ajdustVolume: (macroID: string, payload: newMacroWithAI) => Promise<any>;
  editCycles: (cycle: string, cycleID: string, payload: any) => Promise<any>;
  skipWorkout: (
    microID: string,
    workoutID: string,
    workoutData: any
  ) => Promise<any>;
};
