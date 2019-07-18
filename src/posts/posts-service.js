const PostsService = {
    getAllPosts(knex) {
        return knex.select('*').from('posts')
    },
    insertPost(knex, newPost) {
        return knex
            .insert(newPost)
            .into('posts')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('posts').select('*').where('id', id).first()
    },
    getLikesByPostId(knex, postId) {
        return knex.from('likes').select('*').where('post_id', postId)
    },
    insertLike(knex, newLike) {
        return knex.insert(newLike).into('likes').returning('*').then(rows => {return rows[0]})
    },
    likedByUser(knex, owner_id) {
        return knex.from('likes').where('owner', owner_id).first().then(like => !!like)
    },
    getByOwnerId(knex, owner_id) {
        return knex.from('posts').select('*').where('owner', owner_id)
    },
    deletePost(knex, id) {
        return knex('posts')
            .where({ id })
            .delete()
    },
    updatePost(knex, id, newPostFields) {
        return knex('posts')
            .where({ id })
            .update(newPostFields)
    }
}


module.exports = PostsService