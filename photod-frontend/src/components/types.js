// @flow

export type Node = {
    id: string,
    childrenCount: number,
    totalChildrenCount: number,
    mediaFilesCount: number,
    totalMediaFilesCount: number,
}

export type Directory = Node & {
    fullPath: string,
    name: string,
};

export type Album = Node & {
    name: string,
};

export type Item = {};

export type Tag = Item & {
    id: string,
    label: string,
};

export type Person = Item & {
    id: string,
    name: string,
    facesCount: number,
};

/**
 * Type declaration for MediaFileType.
 */
export type MediaFile = {
    id: string,
    path: string,
    mimeType: string,
};

export type Filmstrip = {
    id: string,
    frames: number,
    width: number,
    height: number,
};

export type Thumbnail = {
    id: string,
    url: string,
    width: number,
    height: number,
};

export type Face = {
    id: string,
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    person: ?Person,
};
