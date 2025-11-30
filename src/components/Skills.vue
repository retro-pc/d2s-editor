<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="mr-4 mb-3">
        <label for="UnusedStatPoints">Unused Stat Points</label>
        <a-input-number id="UnusedStatPoints" v-model:value="save.attributes.unused_stats" :min="0" />
      </div>
      <div class="mr-4 mb-3">
        <label for="UnusedSkillPoints">Unused Skill Points</label>
        <a-input-number id="UnusedSkillPoints" v-model:value="save.attributes.unused_skill_points" :min="0" />
      </div>
    </div>
    <br />
    <div class="d-flex flex-wrap">
      <div class="col-md-4" v-for="i in 3">
        <div class="row">
          <div class="col-md-6" v-for="j in 10">
            <label :for="'Skill' + i + '_' + j">{{save.skills[(i - 1) * 10 + (j - 1)].name}}</label>
            <input type="number" class="form-control" :id="'Skill' + i + '_' + j" min="0" max="20"
                    v-model.number="save.skills[(i - 1) * 10 + (j - 1)].points">
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="form-row">
      <div class="input-group">
        <div class="input-group-prepend">
          <button type="button" class="btn btn-secondary" @click="setAll()">Set All To</button>
        </div>
        <input type="number" min="0" max="20" v-model="allSkills"/>
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