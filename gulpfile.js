const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass")(require("sass"));
const browsersync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");

gulp.task("css", () => {
    return gulp.src("#src/sass/core/style.sass")
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("build/css"))
      .pipe(browsersync.stream())
  });

  gulp.task("copy", () => {
    return gulp.src([
        "#src/img/**/*.{jpeg,jpg,png,svg}",
        "#src/fonts/**/*.{woff2,woff}",
        "#src/index.html"
      ], {
        base: "#src"
      })
      .pipe(gulp.dest("build"))
  });

  gulp.task("clean", () => {
    return del("build")
  });

  gulp.task("server", () => {
    browsersync.init({
      server: "build/",
      notify: false,
      open: true,
      cors: true,
      ui: false
    })

    gulp.watch("#src/sass/**/*.sass", gulp.series("css", "refresh"));
    gulp.watch("#src/index.html", gulp.series("copy"));
    gulp.watch("#src/index.html").on("change", browsersync.reload);
  });

  gulp.task("refresh", (done) => {
    browsersync.reload();
    done();
  });

  gulp.task("build", gulp.series("clean", "css", "copy"));
  gulp.task("start", gulp.series("build", "server"));
