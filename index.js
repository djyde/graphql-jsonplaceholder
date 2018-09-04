const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

const http = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

const typeDefs = gql`
  type Post {
    userId: Int!
    id: Int!
    title: String!
    body: String!
  }

  type Comment {
    postId: String!
    id: Int!
    name: String!
    email: String!
    body: String!
  }

  type User {
    id: Int!
    name: String!
    username: String!
    email: String!
    address: Address!
    phone: String!
    website: String!
    company: Company!
  }

  type Address {
    street: String!
    suite: String!
    city: String!
    zipcode: String!
  }

  type Company {
    name: String!
    catchPhrase: String!
    bs: String!
  }

  input PostInput {
    userId: Int!
    id: Int!
    title: String!
    body: String!
  }

  type Query {
    posts(page: Int, limit: Int, sort: String, order: String): [Post]
  }

  type Mutation {
    createPost(post: PostInput!): Post!
    updatePost(post: PostInput!, postId: Int!): Post!
    deletePost(postId: Int!): Int!
  }
`

const resolvers = {
  Query: {
    async posts(root, args) {
      const {
        page, limit, sort, order
      } = args
      const res = await http.get('/posts', {
        params: {
          _page: page,
          _limit: limit,
          _sort: sort,
          _order: order
        }
      })
      return res.data
    }
  },
  Mutation: {
    async createPost(root, args) {
      const {
        post
      } = args

      const res = await http.post('/posts', {
        data: post
      })

      return res.data.data
    },
    async updatePost(root, args) {
      const {
        post,
        postId
      } = args

      const res = await http.put('/posts/' + postId, {
        data: post
      })

      return res.data.data
    },
    async deletePost(root, args) {
      const { postId } = args
      
      await http.delete('/posts/' + postId)

      return postId
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Ready at ${url}`)
})