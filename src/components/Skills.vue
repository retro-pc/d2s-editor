<template>
  <div>
    <div class="form-row">
      <div class="col-md-4" v-for="i in 3">
        <div class="row">
          <div class="col-md-6" v-for="j in 10">
            <label :for="'Skill' + i + '_' + j">{{save.skills[(i - 1) * 10 + (j - 1)].name}}</label>
            <a-input-number :id="'Skill' + i + '_' + j" :min="0" :max="20" v-model:value="save.skills[(i - 1) * 10 + (j - 1)].points" />
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="form-row">
      <div class="input-group">
        <div class="input-group-prepend">
          <a-button type="default" @click="setAll()">Set All To</a-button>
        </div>
        <a-input-number :min="0" :max="20" v-model:value="allSkills" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      save: Object,
    },
    data() {
      return {
        allSkills: null
      }
    },
    methods: {
      setAll() {
        if(this.allSkills === null || this.allSkills === undefined)
          return;
        for (const skill of this.save.skills) {
          skill.points = this.allSkills;
        }
        this.allSkills = null;
      }
    }
  };  
</script>