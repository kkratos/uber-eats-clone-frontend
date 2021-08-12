module.exports = {
    client: {
        includes: ["./src/**/**.tsx"],
        tagName: "gql",
        service: {
            name: "fuber-eats-backend",
            url: "http://localhost:4000/graphql"
        },
    },
};