'use strict';

module.exports = function(grunt) {
    // Add require for connect-modewrite
    var modRewrite = require('connect-modrewrite');

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        bowerApp: {
            // configurable app path
            app: require('./bower.json').appPath || 'app',
            pkg: grunt.file.readJSON('bower.json')
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= bowerApp.app %>/js/{,*/}*.js'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= bowerApp.app %>/css/{,*/}*.css'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= bowerApp.app %>/{,*/}*.html',
                    '<%= bowerApp.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729,
                base: '<%= bowerApp.app %>'
            },
            livereload: {
                options: {
                    open: 'http://localhost:<%= connect.options.port %>',
                    base: [
                        '.tmp',
                        '<%= bowerApp.app %>'
                    ],
                    // MODIFIED: Add this middleware configuration
                    middleware: function(connect, options) {
                        var middlewares = [];

                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });
                        return middlewares;
                    }
                }
            }

        },
        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= bowerApp.app %>/index.html'],
                ignorePath: '<%= bowerApp.app %>/'
            }
        },
        // Upload bower component
        shell: {
            bowerRegister: {
                command: 'bower register ' + require('./bower.json').name + ' ' + require('./bower.json').repository.url
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= bowerApp.pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'app/js/*.js',
                dest: 'app/build/<%= bowerApp.pkg.name %>.min.js'
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/js/*.js']
        }
    });
    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Register new tasks
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('serve', ['bowerInstall', 'connect', 'watch']);
    grunt.registerTask('publish', ['shell:bowerRegister']);
}
