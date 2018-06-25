const { exec, spawn } = require('child_process');

exec('git symbolic-ref --short HEAD | xargs echo -n', (err, branch) => {
	if (err) {
		console.error(err);
		return;
	}

	if (!['dev', 'rc', 'master'].includes(branch)) {
		return;
	}

	const env = Object.assign({}, process.env, { PREPUSH_HOOK: true });
	const subprocess = spawn('npm', ['test'], { env, stdio: 'inherit' });

	subprocess.on('close', code => {
		if (code !== 0) {
			console.log('::: Tests failed :( ' + code + '\n' +
				'::: "npm test" - get test results\n' +
				'::: "git reset HEAD~1 --soft" - cancel last commit');
		}

		process.exit(code);
	});
});
