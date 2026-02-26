type TGender = 'male' | 'female' | 'lgbt';

type TRole = 'admin' | 'author' | 'user';

type TProvider = 'local' | 'google' | 'facebook';

interface IImage {
    _id: string;
    url: string;
}

export interface IUserLogin {
    _id: string;
    name: string;
    email: string;
    role?: string;
}

export interface ILogin {
    access_token: string;
    user: IUserLogin
}

export interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    cover?: IImage;
    avatar?: IImage;
    avatar_frame?: IImage;
    birthday: string;
    age: number;
    gender: TGender;
    role: TRole;
    provider: TProvider;
    createdAt: string;
    updatedAt: string;
}