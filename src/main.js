import { createApp, ref } from 'vue';
import VueTippy from 'vue-tippy';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

import * as d2s from '../lib/d2';

// import { constants_diablo2_96 } from '../public/d2/constants_diablo2_96.js';
// import { constants_diablo2_97 } from '../public/d2/constants_diablo2_97.js';
// import { constants_diablo2_98 } from '../public/d2/constants_diablo2_98.js';
import { constants_diablo2_99 } from '../public/d2/constants_diablo2_99.js';
import { constants_blizzless_beta_99 } from '../public/d2/constants_blizzless_beta_99.js';
import { constants_blizzless_99 } from '../public/d2/constants_blizzless_99.js';

import App from './components/App.vue';
import utils from './utils.js';

const app = createApp(App);

app.config.globalProperties.$d2s = d2s;

//console.log(constants_96);
// d2s.setConstantData('diablo2', 0x60, constants_diablo2_96); //1.10-1.14d
// d2s.setConstantData('diablo2', 0x61, constants_diablo2_97); //alpha (D2R)
// d2s.setConstantData('diablo2', 0x62, constants_diablo2_98); //2.4 (D2R)
d2s.setConstantData('diablo2', 0x63, constants_diablo2_99); //2.5+ (D2R)
d2s.setConstantData('blizzless_beta', 0x63, constants_blizzless_beta_99);
d2s.setConstantData('blizzless', 0x63, constants_blizzless_99); //2.5+ (D2R)

const work_mod = ref('blizzless');
const work_version = ref(99);
const palettes = ref({});
const clipboard = ref(null);
app.config.globalProperties.$work_mod = work_mod;
app.config.globalProperties.$work_version = work_version;
app.config.globalProperties.$palettes = palettes;
app.config.globalProperties.$clipboard = clipboard;
app.config.globalProperties.$getWorkConstantData = () => d2s.getConstantData(work_mod.value, work_version.value);
app.config.globalProperties.$uuid = utils.uuidv4();

app
  .component('multiselect', Multiselect)
  .use(
    VueTippy,
    // optional
    {
      directive: 'tippy', 
      component: 'tippy',
      componentSingleton: 'tippy-singleton',
      defaultProps: {
        placement: 'auto-end',
        allowHTML: true,
      },
    }
  )
  .mount('#app');