const gulp = require('gulp');
const requireDir = require('require-dir');
const connect = require('gulp-connect-php'); // Toegevoegd voor PHP-server
const browserSync = require('browser-sync').create(); // Toegevoegd voor live reload

requireDir('./gulp');

// const buildPlugin = require('./gulp/script.gulp');

/*= -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
|  PHP Server
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
function phpServer(cb) {
  connect.server(
    {
      base: './src', // Map waar je PHP-bestanden staan
      port: 5000, // Poort waarop de PHP-server draait
      keepalive: true
    },
    () => {
      browserSync.init({
        proxy: '127.0.0.1:5000', // Proxy de PHP-server
        open: false, // Browser automatisch openen
        notify: false // Geen pop-ups in browser
      });
    }
  );
  cb();
}

function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

function watchFiles() {
  gulp.watch('./src/**/*.php', reloadBrowser); // PHP-bestanden monitoren
  gulp.watch('./src/css/**/*.css', reloadBrowser); // CSS-bestanden monitoren
  gulp.watch('./src/js/**/*.js', reloadBrowser); // JavaScript-bestanden monitoren
}

/*= -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
|  Compile
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
gulp.task('compile', gulp.parallel('style', 'script', 'vendor'));
gulp.task('compile:all', gulp.parallel('compile', 'pug'));

/*= -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
|  Deploy
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
gulp.task('build', gulp.series('clean:build', 'build:static', 'compile:all'));
gulp.task('build:test', gulp.series('build', 'watch'));
gulp.task('live', gulp.series('clean:live', 'build', 'build:push'));

/*= -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
|  Run development environment
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
gulp.task(
  'default',
  gulp.series('clean', 'compile', gulp.parallel('watch', phpServer, watchFiles))
); // PHP-server toegevoegd

/*= -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
|  Product
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
gulp.task('product:make', gulp.series('compile:all', 'product'));

gulp.task('live:make', gulp.series('pre:live', 'post:live'));
