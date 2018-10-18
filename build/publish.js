const ghpages = require('gh-pages');

ghpages.publish('dist', err => {
    console.log('boop');
    console.log(err);
});