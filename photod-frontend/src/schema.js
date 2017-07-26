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
  tag?: ?string,
  profile?: ?string,
|};

export type MediaFilesQuery = {|
  mediaFiles: ? {|
    edges:  Array< {|
      // The item at the end of the edge
      node: ? {|
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
