export type TGender = 'male' | 'female' | 'lgbt';

type TRole = 'admin' | 'author' | 'user';

export type TProvider = 'local' | 'google' | 'facebook';

export type TType = 'text' | 'image';

export type TTypeAnnouncement = 'info' | 'warning' | 'maintenance' | 'event'

// Common
export interface ICreated {
    _id: string;
    createdAt: string;
}

export interface IUpdated {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string;
    upsertedCount: number;
    matchedCount: number;
}

//  Image
interface IImage {
    _id: string;
    url: string;
}

// Auth & User

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
    avatar_frame?: IFrame;
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

// Frame
export interface IFrame {
    _id: string;
    name: string;
    image: IImage;
    createdAt: string;
    updatedAt: string;
}

// Comment
export interface IUserComment {
    _id: string;
    name: string;
    avatar: IImage;
    avatar_frame: IFrame;
}

export interface IReplyTo {
    _id: string;
    name: string
}

export interface IComment {
    _id: string;
    userId: IUserComment;
    comicSlug: string;
    comicName: string;
    chapterId: string;
    chapterName: string;
    replyTo: IReplyTo;
    page: number;
    parent: string;
    content: string;
    likeCount: number;
    replyCount: number;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
}

// emoji
export interface ICategoryEmoji {
    _id: string;
    name: string;
    name_unsigned: string;
    image: IImage;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IEmoji {
    _id: string;
    name: string;
    type: TType;
    text?: string
    image?: IImage
    category: ICategoryEmoji
    isActive: boolean;
    isGif: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IDetailEmoji {
    _id: string;
    name: string;
    type: TType;
    text?: string
    image?: IImage
    category: string;
    isActive: boolean;
    isGif: boolean;
    createdAt: string;
    updatedAt: string;
}

// Announcement
export interface IAnnouncement {
    _id: string;
    title: string;
    content: string;
    type: TTypeAnnouncement;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}