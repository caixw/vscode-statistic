// SPDX-License-Identifier: MIT

'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const cached = require('gulp-cached');
const vsce = require('vsce');

const extension = ts.createProject('tsconfig.json');

const rootDir = extension.options.rootDir;
const outDir = extension.options.outDir;

// 拷贝 testdata 目录下的内容
function copy() {
    return gulp.src(rootDir+'/**/testdata/**/*', {base:'src'}).
        pipe(gulp.dest(outDir))
}

// 编译当前的扩展
async function compileExtension() {
    let s = extension.src()
        .pipe(cached('watch'))

    if (extension.options.sourceMap) {
        s = s.pipe(sourcemaps.init())
            .pipe(extension())
            .pipe(await sourcemaps.write('./'))
    }

    return s.pipe(gulp.dest(outDir));
}

function clean() {
    return del(outDir);
}

function watch() {
    return gulp.watch(
        rootDir,
        {
            delay: 500,
            queue: true,
        },
        compileExtension,
    );
}

function createVSIX() {
    return vsce.createVSIX();
}

// 发布当前的扩展
function publish() {
    return vsce.publish();
}

exports.compile = gulp.series(
    clean,
    compileExtension,
    copy,
);

exports.clean = clean;

exports.watch = watch;

exports.publish = gulp.series(
    createVSIX,
    publish,
);

exports.package = gulp.series(
    compileExtension,
    createVSIX,
);
