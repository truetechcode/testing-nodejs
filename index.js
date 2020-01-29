require('dotenv').config({
  path: './.env',
});
const DEBUG_MODE = typeof v8debug === 'object' || /--debug|--inspect/.test(process.execArgv.join(' '));

if (process.env.NODE_ENV === 'production') {
  require('./dist');
} else {
  if (DEBUG_MODE) {
    // let debug mode handle nodemon auto-restarts
    require('./dev.js');
  } else {
    require('nodemon')({ script: 'dev.js' });
  }
}
