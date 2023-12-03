<template>
  <NavBarDash></NavBarDash>
  <div class="app-layout-container bg grey padd ">


      <div class="left_tree">
        <va-tree-view :nodes="nodes">
          <template #content="node">

            <div class="flex items-center">


              <div class="mr-2" @click="expand(node)">
                <span
                    v-if="node.label"
                    :class="(node.file)?'fs_'+node.file.file_state:'s'"
                >
                  <b v-if="node.active">{{ node.label }}</b>
                  <span v-else>{{ node.label }}</span>
                  </span>
              </div>
              <div>


                <va-select
                    class="small"
                    v-if="node.repo && node.repo.branches"
                    :modelValue="node.repo.branch"
                    @update:modelValue="(e)=>{node.repo.setBranch(e);node.repo.getCommits()}"

                    :options="node.repo.branches"
                >
                  <template #content="{ value }">
                    <va-chip class="mr-2" size="small">
                      {{ value[0] }}
                    </va-chip>
                  </template>
                </va-select>
              </div>
              <template v-if="node.repo">
                <va-button
                    class="mr-2 mb-2 nom"
                    preset="secondary"
                    hover-behavior="opacity"
                    icon="add"
                    :hover-opacity="0.4"
                    @click="newFileDialog(node.repo)"

                />
                <va-button
                    v-if="node.changes"
                    class="mr-2 mb-2 nom"
                    preset="secondary"
                    hover-behavior="opacity"
                    icon="save"
                    :hover-opacity="0.4"
                    @click="newPWDialog(node.repo)"
                />

              </template>

            </div>
          </template>
        </va-tree-view>


      </div>
      <div class="mid file">
        <JsonEditorVue
            ref="jsonEditor"
            v-if="dashboardStore.state.file"
            :mainMenuBar="false"
            :modelValue="''"
            mode="text"
            v-bind="{'onChange':editor_update_content}"

        />
      </div>
      <div class="mid hist">
        <Timeline v-if="repo_selected" :timeline='repo_selected.commits'>
          <template #left="{stop}">
            <va-chip class="mr-2" size="small">
              {{ stop.name.slice(-8) }}
            </va-chip>
          </template>

          <template #right="{stop}">
            {{
              format(stop.creation_date)
            }}
          </template>
        </Timeline>



      </div>
  </div>
  <RenameDialog v-model="showRenameDialog"  @name="(path)=>{newFile(path)}"></RenameDialog>
  <PWDialog v-model="showPWDialog"  @user="commit"></PWDialog>

</template>

<script setup lang="ts">
import NavBarDash from "../dashboard/NavBarDash.vue";
import {useDashboardStore} from "@/stores/DashboardStore";
import {computed, ref} from "vue";
import type {FileI, RepoI} from "@/generated/gitea/gitea_wrapper/RepoT";
import {FileState} from "@/generated/gitea/gitea_wrapper/RepoT";
import JsonEditorVue from 'json-editor-vue';
import RenameDialog from "@/routes/editor/dialog/RenameDialog.vue";
import File from "@/generated/gitea/gitea_wrapper/File";
import PWDialog from "@/routes/editor/dialog/PWDialog.vue";
import GiteaWrapper from "@/generated/gitea/gitea_wrapper/gitea.wrapper";
import Timeline from "@/utils/Timeline/Timeline.vue";
import moment from "moment";

const dashboardStore = useDashboardStore();
dashboardStore.fetchDashboardAllCategories();

let repo =null;
const showRenameDialog = ref(false);
const jsonEditor = ref(null);
const showPWDialog = ref(false);
let repo_selected = ref(null);
const nodes = computed(() => {
  return dashboardStore.state.repos.map((e:RepoI)=>{return {
        "id": e.id,
        "label": e.name,
        "icon": "folder",
        "repo":e,
        "changes":e.files.find(f=>f.file_state==FileState.NEW||f.file_state==FileState.MODIFIED||f.file_state==FileState.DELETED),
        "children":e.files.map((f:FileI)=>{
          return {
            "id": f.name,
            "label": f.path,
            "active":(f == dashboardStore.state.file),
            "icon": "note",
            "file":f
          }
        })
  }})
},{deep:true})
const file_s = computed(() => {
  return JSON.stringify(dashboardStore.state.file)
});
const expand = async function(node){
  if(node.repo){
    dashboardStore.file = null;
    dashboardStore.loadRepoFiles(node.repo);
    repo_selected = node.repo

  }else if(node.file){
    repo_selected = null;
    await dashboardStore.loadFile(node.file)
    jsonEditor.value.jsonEditor.select(null);
    jsonEditor.value.jsonEditor.set({json:node.file.getContent()})
  }
}
const editor_update_content =(e)=>{
  //console.log(e);
  try{
    let obj = JSON.parse(e.text);
    dashboardStore.state.file.setContent(obj)
  }catch(r) {
    //console.log(r)
  }

}
const newFileDialog = (_repo)=>{
  repo = _repo;
  showRenameDialog.value = true;
}
const newPWDialog = (_repo)=>{
  repo = _repo;
  showPWDialog.value = true;
}
const newFile=(path:string)=>{
  if(repo) {
    repo.addFile(new File(path,path))
  }
}
const commit=async (user)=>{
  try{
    let token = await new GiteaWrapper().getToken(user[0],user[1]);
    await repo.commit(token)
    await repo.getFiles()
  } catch (e){
    console.log(e);
  }

}
const format = (dateraw)=>{
  return moment(dateraw).format('DD.MM.YY HH:mm:SS')
}
</script>

<style>
.vue-grid-item{transition:all .2s ease;transition-property:left,top,right}.vue-grid-item.no-touch{-ms-touch-action:none;touch-action:none}.vue-grid-item.cssTransforms{transition-property:transform;left:0;right:auto}.vue-grid-item.cssTransforms.render-rtl{left:auto;right:0}.vue-grid-item.resizing{opacity:.6;z-index:3}.vue-grid-item.vue-draggable-dragging{transition:none;z-index:3}.vue-grid-item.vue-grid-placeholder{background:red;opacity:.2;transition-duration:.1s;z-index:2;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.vue-grid-item>.vue-resizable-handle{position:absolute;width:20px;height:20px;bottom:0;right:0;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=);background-position:bottom right;padding:0 3px 3px 0;background-repeat:no-repeat;background-origin:content-box;box-sizing:border-box;cursor:se-resize}.vue-grid-item>.vue-rtl-resizable-handle{bottom:0;left:0;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);background-position:bottom left;padding-left:3px;background-repeat:no-repeat;background-origin:content-box;cursor:sw-resize;right:auto}.vue-grid-item.disable-userselect{user-select:none}.vue-grid-layout{position:relative;transition:height .2s ease}.vue-grid-layout{background:transparent}.vue-grid-layout .smartwidget{height:inherit;width:inherit}.vue-grid-layout .smartwidget.smartwidget-fullscreen{height:100%;width:100%}.smart-widget__loading-mask{position:absolute;z-index:2000;background-color:#ffffffe6;margin:0;top:0;right:0;bottom:0;left:0;-webkit-transition:opacity .3s;transition:opacity .3s}.smart-widget__loading-mask .loading-spinner{top:50%;margin-top:-21px;width:100%;text-align:center;position:absolute}.smart-widget__loading-mask .circular{width:42px;height:42px;animation:loading-rotate 2s linear infinite}.smart-widget__loading-mask .path{animation:loading-dash 1.5s ease-in-out infinite;stroke-dasharray:90,150;stroke-dashoffset:0;stroke-width:2;stroke:#5282e4;stroke-linecap:round}@keyframes loading-rotate{to{transform:rotate(360deg)}}@keyframes loading-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40px}to{stroke-dasharray:90,150;stroke-dashoffset:-120px}}.collapse-transition[data-v-5f8fde58]{transition:.3s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out}.vue-grid-item{touch-action:none;box-sizing:border-box}.vue-grid-item.vue-grid-placeholder{background:#7cbeff;opacity:.2;transition-duration:.1s;z-index:2;user-select:none}body.no-overflow[data-v-059e0ffc]{overflow:hidden;position:fixed;width:100%}.smartwidget[data-v-059e0ffc]{box-sizing:border-box;background:#fff;box-shadow:0 1px 2px #0000000d;border:1px solid #ebeef5;width:100%;transition:.3s}.smartwidget.is-always-shadow[data-v-059e0ffc]{box-shadow:0 0 10px #e9e9e9}.smartwidget.is-hover-shadow[data-v-059e0ffc]:hover{box-shadow:0 0 10px #e9e9e9}.smartwidget.is-never-shadow[data-v-059e0ffc]{box-shadow:0 1px 2px #0000000d}.smartwidget .widget-header[data-v-059e0ffc]{display:flex;border-bottom:1px solid #ebeef5}.smartwidget .widget-header .widget-header__title[data-v-059e0ffc]{display:inline-block;position:relative;width:auto;margin:0;font-weight:normal;letter-spacing:0;align-items:center;font-size:16px}.smartwidget .widget-header .widget-header__subtitle[data-v-059e0ffc]{font-size:12px;color:#777;margin-left:10px}.smartwidget .widget-header .ellis[data-v-059e0ffc]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.smartwidget .widget-header .widget-header__prefix[data-v-059e0ffc]{background:#0076db;width:2px;height:16px;margin-left:10px}.smartwidget .widget-header .widget-header__toolbar[data-v-059e0ffc]{display:flex;justify-content:flex-end;align-items:center;flex:1;padding:0;margin:0}.smartwidget .widget-header .widget-header__toolbar a[data-v-059e0ffc]{display:inline-block;text-decoration:none;text-align:center;height:24px;line-height:28px;padding:0;margin:0;color:#333;min-width:35px;position:relative;font-family:Arial,Helvetica,sans-serif;border-left:1px solid rgba(0,0,0,.09)}.smartwidget .widget-body-simple[data-v-059e0ffc]{display:flex;height:inherit;width:inherit}.smartwidget .widget-body-simple .widget-body__content[data-v-059e0ffc]{width:100%}.smartwidget .widget-body[data-v-059e0ffc]{display:flex;flex-direction:column;will-change:height;position:relative;overflow:hidden}.smartwidget .widget-body .widget-body__content[data-v-059e0ffc]{flex:1}.smartwidget .widget-body .widget-body__content.fixed-height[data-v-059e0ffc]{overflow-y:scroll}.smartwidget .widget-body .widget-body__footer[data-v-059e0ffc]{position:relative}.smartwidget .widget-body .widget-body__footer.has-group[data-v-059e0ffc]{left:0;bottom:0;width:100%}.smartwidget .widget-body.is-collapse[data-v-059e0ffc]{transition:.3s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out}.smartwidget.smartwidget-fullscreen[data-v-059e0ffc]{position:fixed;height:100%;width:100%;top:0;left:0;z-index:6666}.smartwidget.smartwidget-fullscreen .widget-header[data-v-059e0ffc]{cursor:default}.smartwidget svg.sw-loading[data-v-059e0ffc]{animation:rotating 2s linear infinite;cursor:not-allowed}

.va-select-dropdown.small{
  width: 150px;
}



</style>
<style scoped lang="scss">
@import '@/scss/colors.scss';
.padd{
  padding: 15px;
}
.app-layout-container{
  position: absolute;
  left: 65px;
  top: 64px;
  bottom: 0;
  right: 0;
  display: grid;
  grid-template-columns: 400px 1fr 200px;
}
.layout-center{
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100%;

  h1{
    font-size: 45px;
    font-weight: 300;
  }
}
.flex.items-center{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  .small{
    width: 150px!important;
  }
}

/*'NEW',*/
.fs_0{
  color:$file-new;
}
/*'MODIFIED',*/
.fs_1{
  color:$file-modified;
}
/*'DELETED',*/
.fs_2{
  color:$file-deleted;
}
/*'UNTOUCHED',*/
.fs_3{

}
.nom{
  margin-right: 0!important;
  margin-bottom: 0!important;
}
</style>
