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
}

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

export type Person = {
    id: string,
    name: string,
};

export type Face = {
    id: string,
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    person: ?Person,
};
