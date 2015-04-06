module.exports = function(grunt) {

  var ssh_credentials = grunt.file.readJSON('ssh_credentials.json');
  grunt.initConfig({
  	scp: {
  		options: ssh_credentials,
  		piserver: {
  			files: [{
				cwd: './app/public/',
				src: '**/*',
				filter: 'isFile',
				dest: '/home/pi/work/public/'
  			},
  			{
				cwd: './app/',
				src: 'app.js',
				dest: '/home/pi/work/'
  			},
  			{
				cwd: './app/',
				src: 'package.json',
				dest: '/home/pi/work/'
  			}]
  		}
  	},
  	sshconfig: {
	  "piserver": ssh_credentials
	},
	sshexec: {
	  npm_install: {
	    command: 'npm install /home/pi/work/',
	    options: {
	      config: 'piserver'
	    }
	  },
	  forever_stop: {
	    command: 'forever stop /home/pi/work/app.js',
	    options: {
	      config: 'piserver'
	    }
	  },
	  forever_start: {
	    command: 'forever start /home/pi/work/app.js',
	    options: {
	      config: 'piserver'
	    }
	  }
	}
  });

  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-scp');

  grunt.registerTask('force_forever_stop', 'runs forever stop', function () {
    var tasks = ['sshexec:forever_stop'];

    grunt.option('force', true);
    grunt.task.run(tasks);
});

  grunt.registerTask('deploy', [
  	'scp:piserver', 
  	'sshexec:npm_install', 
  	'force_forever_stop', 
  	'sshexec:forever_start'
  	]);

};