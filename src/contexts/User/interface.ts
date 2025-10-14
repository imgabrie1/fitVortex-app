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
  volumes: any;
  notes: string;
  id: string;
  microCycleName: string;
  createdAt: string | Date;
  trainingDays: number;
  cycleItems: CycleItems[];
}

export interface CycleItems {
  microCycle: any;
  id: string;
  createdAt: string | Date;
  workout: Workout;
  sets: Set[];
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

export interface Set {
  id: string;
  reps: number;
  weight: string;
  notes: string | null;
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

export type WorkoutWithSets = Omit<Workout, "workoutExercises"> & {
  workoutExercises: WorkoutExerciseWithSets[];
};

export interface MacroCycle {
  id: string;
  macroCycleName: string;
  startDate: string;
  endDate: string;
  microQuantity: number;
  items: [
    {
      id: string;
      createdAt: string | Date;
      microCycle: MicroCycle;
    }
  ];
}
export interface MicroCycle {
  id: string;
  microCycleName: string;
  createdAt: string | Date;
  trainingDays: number;
  user: iUser;
}

export interface SetInput {
  reps: number;
  weight: number;
  notes?: string;
}

export interface ExerciseInput {
  exerciseID: string;
  sets: SetInput[];
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
  id: string;
  microCycleName: string;
  trainingDays: number;
}

export interface ExerciseTarget {
  exerciseId: string;
  targetSets: number;
}

export interface ExerciseInCreateAndPatch {
  exercises: ExerciseTarget[];
}

export interface iCreateWorkout {
  name: string;
  exercises: ExerciseInCreateAndPatch;
}

export type iPatchWorkout = Partial<iCreateWorkout>;

export type UserContextData = {
  token: string | null;
  user: iUserResponse | null;
  loading: boolean;
  loadingForm: boolean;
  login: (creds: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: iDataRegister) => Promise<void>;
  getAllWorkouts: () => Promise<WorkoutWithSets[]>;
  getAllMacroCycles: () => Promise<MacroCycle[]>;
  getAllMicroCycles: () => Promise<any>;
  getMacroCycleByID: (macroID: string) => Promise<any>;
  getMicroCycleByID: (microID: string) => Promise<any>;
  toWorkOut: (
    microID: string,
    workoutID: string,
    workoutData: any
  ) => Promise<any>;
  createMacroCycle: (payload: any) => Promise<iCreateMacroCycle>;
  createMicroCycle: (payload: any) => Promise<iCreateMicroCycle>;
  addMicroInMacro: (macroID: string, microID: string) => Promise<any>;
  deleteCycles: (cycle: string, cycleID: string) => Promise<void>;
  getAllExercise: (page?: number, limit?: number) => Promise<Exercise[]>;
  createWorkout: (payload: iCreateWorkout) => Promise<any>;
  addWorkoutInMicro: (microID: string, workoutID: string) => Promise<any>;
  addExerciseInWorkout: (payload: ExerciseInCreateAndPatch, workoutID: string) => Promise<any>;
};
