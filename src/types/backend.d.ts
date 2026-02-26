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