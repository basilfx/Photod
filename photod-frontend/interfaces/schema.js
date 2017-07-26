/* @flow */
//  This file was automatically generated and should not be edited.

export type SearchMutationVariables = {|
  query: string,
|};

export type SearchMutation = {|
  search: ? {|
    results: ? Array< {|
      model: ?string,
      pk: ?string,
      score: ?number,
      text: ?string,
    |} >,
  |},
|};

export type MediaFilesQueryVariables = {|
  cursor?: ?string,
|};

export type MediaFilesQuery = {|
  jobs: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        title: string,
        progress: ?number,
        items: ?number,
      |},
    |} >,
    pageInfo: {|
      // When paginating forwards, the cursor to continue.
      endCursor: ?string,
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
    |},
  |},
|};

export type AlbumsQueryVariables = {|
  parentId?: ?string,
  cursor?: ?string,
|};

export type AlbumsQuery = {|
  albums: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        name: string,
      |},
    |} >,
    pageInfo: {|
      // When paginating forwards, the cursor to continue.
      endCursor: ?string,
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
    |},
  |},
|};

export type DirectoriesQueryVariables = {|
  parentId?: ?string,
  cursor?: ?string,
  collapse?: ?boolean,
|};

export type DirectoriesQuery = {|
  directories: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        fullPath: string,
        name: string,
        childrenCount: ?number,
        totalChildrenCount: ?number,
        mediaFilesCount: ?number,
        totalMediaFilesCount: ?number,
      |},
    |} >,
    pageInfo: {|
      // When paginating forwards, the cursor to continue.
      endCursor: ?string,
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
    |},
  |},
|};

export type ProfileQuery = {|
  me: ? {|
    // The ID of the object.
    id: string,
    // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
    username: string,
    firstName: string,
    lastName: string,
    lastLogin: ?any,
    dateJoined: any,
  |},
|};

export type SharedQueryVariables = {|
  cursor?: ?string,
|};

export type SharedQuery = {|
  shares: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        mediaFile: {|
          path: string,
        |},
        views: number,
        created: any,
        expires: ?any,
        url: ?string,
      |},
    |} >,
    pageInfo: {|
      // When paginating forwards, the cursor to continue.
      endCursor: ?string,
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
    |},
  |},
|};

export type MediaFileFragmentFragment = {|
  // The ID of the object.
  id: string,
  path: string,
  name: ?string,
  url: ?string,
  mimeType: string,
  fileSize: ?number,
  width: ?number,
  height: ?number,
  duration: ?number,
  orientation: ?number,
  recorded: ?any,
  created: any,
  faces: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        person: ? {|
          // The ID of the object.
          id: string,
          name: string,
        |},
      |},
    |} >,
  |},
  palette: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        color: string,
        prominence: number,
      |},
    |} >,
  |},
  thumbnails: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        width: number,
        height: number,
        url: ?string,
      |},
    |} >,
  |},
  filmstrips: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
        // The ID of the object.
        id: string,
        width: number,
        height: number,
        url: ?string,
        frames: number,
      |},
    |} >,
  |},
|};
