var assert = require('assert');

suite('Posts', function() {

  ltest('server and client', function(done, server, client) {
    server.eval(function() {
      Posts.find().observe({
        added: addedNewPost
      });

      function addedNewPost(post) {
        emit('post', post);
      }
    }).once('post', function(post) {
      assert.equal(post.title, 'hello title');
      done();
    });

    client.eval(function() {
      Posts.insert({title: 'hello title'});
    });
  });

  ltest('2 client', function(done, server, c1, c2) {
    c1.eval(function() {
      Posts.find().observe({
        added: addedNewPost
      });

      function addedNewPost(post) {
        emit('post', post);
      }
      emit('done');
    }).once('post', function(post) {
      assert.equal(post.title, 'from c2');
      done();
    }).once('done', function() {
      c2.eval(insertPost);
    });

    function insertPost() {
      Posts.insert({title: 'from c2'});
    }
  });

});
