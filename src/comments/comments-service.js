const CommentsService = {
    getAllComments(knex) {
        return knex.select('*').from('comments')
    },
    insertComment(knex, newComment) {
      return knex
        .insert(newComment)
        .into('comments')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex
        .from('comments')
        .innerJoin('users', 'comments.owner', '=', 'users.id')
        .innerJoin('posts', 'comments.post_id', '=', 'posts.id')
        .where('comments.post_id', id)
        .select('comments.id', 'comments.comment', 'comments.date_commented', 'users.first_name', 'users.last_name', 'posts.post_title')
    },
    deleteComment(knex, id) {
      return knex('comments')
        .where({ id })
        .delete()
    },
    updateComment(knex, id, newCommentFields) {
      return knex('comments')
        .where({ id })
        .update(newCommentFields)
    },
}
  
module.exports = CommentsService