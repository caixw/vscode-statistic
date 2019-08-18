// SPDX-License-Identifier: MIT

'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const vsce = require('vsce');

const extension = ts.createProject('tsconfig.json');

 // 编译当前的扩展
async function compileExtension() {
    let s = extension.src()

    if (extension.options.sourceMap) {
        s = s.pipe(sourcemaps.init())
            .pipe(extension())
            .pipe(await sourcemaps.write('./'))
    }

    s.pipe(gulp.dest(extension.options.outDir));
}

function clean() {
    return del(extension.options.outDir);
}

function watch() {
    gulp.watch(extension.options.rootDir, compileExtension);
}

function createVSIX() {
    return vsce.createVSIX();
}

// 发布当前的扩展
function publish() {
    return vsce.publish();
}

gulp.task('compile', compileExtension);

gulp.task('clean', clean);

gulp.task('watch', watch);

gulp.task('publish', gulp.series(createVSIX, publish));

gulp.task('package', gulp.series(compileExtension, createVSIX));
