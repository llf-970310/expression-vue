<template>
  <div>
    <el-row class="synonyms-pairs">
      [
      <el-tag v-for="synonyms in synonymsPairs" :key="synonyms" type="info" closable :disable-transitions="true"
              @close="handleClose(synonyms)"
              class="synonyms">{{synonyms}}
      </el-tag>
      <el-input
          v-if="synonymsInputVisible"
          v-model="synonymsInputValue"
          ref="saveSynonymsInput"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
          size="small"
          class="synonyms-new-input">
      </el-input>
      <el-button v-else size="small" @click="showInput" class="synonyms-new-btn">+ 添加同义词</el-button>
      ]
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "synonyms-modifiable",
    props: {
      // 一组同义词
      synonymsPairs: Array
    },
    data() {
      return {
        synonymsInputVisible: false,
        synonymsInputValue: ''
      }
    },
    mounted() {
      // console.log(this.synonymsPairs)
    },
    methods: {
      handleClose(toDelete) {
        // console.log(toDelete)
        this.synonymsPairs.splice(this.synonymsPairs.indexOf(toDelete), 1)
      },

      showInput() {
        this.synonymsInputVisible = true
        this.$nextTick(() => {
          this.$refs.saveSynonymsInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        let synonymsInputValue = this.synonymsInputValue
        if (synonymsInputValue) {
          this.synonymsPairs.push(synonymsInputValue)
        }
        this.synonymsInputVisible = false
        this.synonymsInputValue = ''
      }
    }
  }
</script>

<style scoped>
  .synonyms-pairs {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .synonyms {
    margin-left: 5px;
    margin-right: 5px;
  }

  .synonyms-new-input {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .synonyms-new-btn {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>