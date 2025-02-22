import fs from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import pug from 'gulp-pug';
import mjml from 'gulp-mjml';
import mjmlEngine from 'mjml';
import imagemin, { gifsicle, mozjpeg, optipng } from 'gulp-imagemin';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import data from 'gulp-data';
import juice from '@thasmo/gulp-juice';
import { deleteSync } from 'del';
import rename from 'gulp-rename';
import zl from 'zip-lib';
import pugLint from 'gulp-pug-linter';
import gulpStylelint from 'gulp-stylelint-esm';

const PATHS = {
  dist: 'dist',
  src: './src',
  email_src: './src/emails',
  index: './src/index.pug',
  zipPath: './dist'
};
const server = browserSync.create();

// Get Folder
function getFolders (dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

const FOLDERS = getFolders(PATHS.email_src);

function clean (done) {
  console.log('>>>> STARTING DEL TASK ✂ <<<<');
  deleteSync(PATHS.dist);
  done();
}

function boilerplate (done) {
  console.log('>>>> CREATING TEMPLATE STRUCTURE EMAIL <<<<');
  const args = yargs(hideBin(process.argv)).command('curl <url>', 'fetch the content of the URL', () => {
    console.info(args);
  }).demandCommand(1).parse();

  gulp.src(path.join(PATHS.src, '/boilerplate/**/*'))
    .pipe(gulp.dest(`${PATHS.email_src}/${args.name}`));

  done();
}

function index (done) {
  console.log('>>>> STARTING INDEX TASK 📄 <<<<');
  gulp.src(PATHS.index)
    .pipe(pug({
      locals: { links: FOLDERS }
    }))
    .pipe(gulp.dest(PATHS.dist));

    done();
}

function images (done) {
  console.log('>>>> STARTING IMAGES TASK 🖼 <<<<');
  FOLDERS.map(folder => {
    return gulp.src(path.join(PATHS.email_src, folder, '/img/*'), { encoding: false })
      // .pipe(imagemin([
      //   gifsicle({ interlaced: true }),
      //   mozjpeg({ quality: 75, progressive: true }),
      //   optipng({ optimizationLevel: 5 })
      // ]))
      .pipe(gulp.dest(path.join(PATHS.dist, folder, '/img')));
  });

  done();
}

function mjmlFn (done) {
  console.log('>>>> STARTING MJML TASK 📄 <<<<');
  FOLDERS.map(folder => {
    return gulp.src(path.join(PATHS.email_src, folder, '/index.mjml'))
      .pipe(mjml(mjmlEngine, { minify: true }))
      .pipe(gulp.dest(path.join(PATHS.dist, '/', folder)));
  });

  done();
}

function pugFn (done) {
  console.log('>>>> STARTING PUG TASK 📄 <<<<');
  FOLDERS.map(folder => {
    return gulp.src(path.join(PATHS.email_src, folder, '/index.pug'))
      .pipe(data(function () {
        return JSON.parse(fs.readFileSync(path.join(PATHS.email_src, folder, '/data.json')));
      }))
      .pipe(pug({
        pretty: false
      }))
      .pipe(juice({
        includeResources: true,
        removeStyleTags: false,
        preserveMediaQueries: true,
        webResources: { links: true, scripts: false, images: false, relativeTo: '.' }
      }))
      .pipe(rename('index.html'))
      .pipe(gulp.dest(path.join(PATHS.dist, '/', folder)));
  });

  done();
}

function pugLinter (done) {
  FOLDERS.map(folder => {
    return gulp.src(path.join(PATHS.email_src, folder, '/**/*.pug'))
      .pipe(pugLint({  reporter: 'default', failAfterError: true }));
  });

  done();
}

function stylesLint (done) {
  console.log('>>>> STARTING LINT STYLES TASK 🖌<<<<');
  FOLDERS.map(folder => {
    return gulp.src(path.join(PATHS.email_src, folder, '/styles/**/*.{css,scss'))
      .pipe(gulpStylelint({
        failAfterError: true,
        reporters: [{ formatter: 'string', console: true }]
      }));
  });

  done();
}

function reload (done) {
  server.reload();
  done();
}

function serve (done) {
  server.init({
    server: {
      baseDir: PATHS.dist
    }
  });

  done();
}

const watch = () => {
  console.log('>>>> STARTING WATCH TASK 👀 <<<<');
  gulp.watch(PATHS.index, gulp.series(index, reload));
  gulp.watch(path.join(PATHS.email_src, '/**/**/*.mjml'), gulp.series(mjmlFn, reload));
  gulp.watch(path.join(PATHS.email_src, '/**/img/*.{png,jpeg,jpg,svg,gif}'), gulp.series(images, reload));
  // gulp.watch(['./src/includes/*', './src/layout/*.pug', `./${PATHS.email_src}/**/*.pug`, `./${PATHS.email_src}/data.json`], gulp.series(pugFn, reload));
  gulp.watch(path.join(PATHS.email_src, '/**/styles/*.{css,scss}'), gulp.series(pugFn, reload));
};

function zipFn (done) {
  console.log('>>>> STARTING ZIPS TASK 🗜<<<<');
  FOLDERS.map(folder => {
    zl.archiveFolder(path.join(PATHS.dist, folder), path.join(PATHS.zipPath, 'ZIPS', `${folder}.zip`)).then(() => {
      console.log(`>>>> ZIP FILE ${folder} CREATED <<<<`);
    }, function(err) {
      console.log(`>>>> ERROR ${folder} 💔<<<<`);
      console.log(err);
    });
  });

  done();
}

const initialDev = gulp.series(images, mjmlFn);
const initialBuild = gulp.series(images, mjmlFn);

const dev = gulp.series(index, initialDev, serve, watch);
const build = gulp.series(clean, index, initialBuild);

export { boilerplate, build, zipFn };
export default dev;
