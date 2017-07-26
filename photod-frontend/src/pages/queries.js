import gql from 'graphql-tag';

const Directories = gql`
    query Directories($parentId: ID, $after: String, $collapse: Boolean) {
        directories(first: 100, after: $after, parentId: $parentId, collapse: $collapse) {
            edges {
                node {
                    id
                    fullPath
                    name
                    childrenCount
                    totalChildrenCount
                    mediaFilesCount
                    totalMediaFilesCount
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

const Tags = gql`
    query Tags($after: String) {
        tags(first: 100, after: $after) {
            edges {
                node {
                    id
                    label
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default {
    Directories,
    Tags,
};
