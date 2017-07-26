// @flow

function createFetchNext(data, key: string) {
    return () => data.fetchMore({
        variables: {
            after: data[key].pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
                return previousResult;
            }

            return {
                ...previousResult,
                [key]: {
                    ...previousResult[key],
                    edges: [
                        ...previousResult[key].edges,
                        ...fetchMoreResult[key].edges,
                    ],
                    pageInfo: fetchMoreResult[key].pageInfo,
                },
            };
        },
    });
}

function createConnectionProps(data, key: string, converter?: (object) => object) {
    return {
        loading: data.loading,
        [key]: converter ? converter(data[key]) : data[key],
        hasNext: data[key] && data[key].pageInfo.hasNextPage,
        fetchNext: createFetchNext(data, key),
    };
}

function fromRelay(data) {
    if (!data || typeof data !== 'object') {
        return data;
    }

    if (data['__typename'] && data['__typename'].endsWith('Connection')) {
        return data.edges.map(edge => fromRelay(edge.node));
    }

    const result = {};

    for (const key in data) {
        if (key === '__typename') {
            continue;
        }

        result[key] = fromRelay(data[key]);
    }

    return result;
}

export {
    createFetchNext,
    createConnectionProps,
    fromRelay,
};
