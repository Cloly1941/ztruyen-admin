export type TGender = 'male' | 'female' | 'lgbt';

type TRole = 'admin' | 'author' | 'user';

export type TProvider = 'local' | 'google' | 'facebook';

interface IImage {
    _id: string;
    url: string;
}

export interface IUserLogin {
    _id: string;
    name: string;
    email: string;
    role: TRole;
}

export interface ILogin {
    access_token: string;
    user: IUserLogin
}

export interface IUserProfile extends IUserLogin {
    bio?: string;
    cover?: IImage;
    avatar?: IImage;
    avatar_frame?: IImage;
    birthday: string;
    age: number;
    gender: TGender;
    provider: TProvider;
    createdAt: string;
    updatedAt: string;
}

export interface IUser extends IUserProfile {
    isDeleted: boolean;
}

export interface IUserCreated {
    _id: string;
    createdAt: string;
}

export interface IUserUpdated {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string;
    upsertedCount: number;
    matchedCount: number;
}