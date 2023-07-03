<script setup lang="ts">
import axios from "axios"

const todoObj = reactive({
  id: 0,
  todo: "",
  isCompleted: false,
  createdAt: "",
})

const newList = ref<any>([]);
const updateObj = ref();
const isCheck = ref(false);
const checkBoxArray: Ref<number[]> = ref([]);
const noResult = ref();

onMounted(() => {
  getTodo();
});

const enterValue = async (item: any) => {
  if (isCheck.value == true) {
    const data = {
      todo: item.todo,
      isCompleted: checkBoxArray.value[item.id],
      createdAt: new Date().toDateString(),
    };

    await axios
      .put(`api/todoUpdate?id=${updateObj.value.id}`, data)
      .then((res) => {
        console.log("Response Updated todoObj.todo =>", res.data)
      });
    todoObj.todo = "";
    await getTodo();
    isCheck.value = false;
  } else {
    const data = {
      todo: item.todo,
      isCompleted: false,
      createdAt: new Date().toDateString(),
    };

    await axios.post("/api/todoCreate", data).then((res) => {
      if (res.data.reason == true) {
        alert(res.data.smg);
      }
    })
    todoObj.todo = "";
    await getTodo();
    isCheck.value = false;
  }
};

const getTodo = async () => {
  await axios.get("/api/todoGet").then((res) => {
    newList.value = res.data;
  });
};

const deleteTodo = async (id: number) => {
  if(newList.value.data.length == 1){
    alert("You can't delete the last one")
  } else {
    await axios.delete(`/api/todoDelete?id=${id}`).then((res) => {
      console.log("Response Deleted =>", res.data)
    });
    await getTodo();
  }
};

watch(newList, (newValue) => {
  newList.value.data.forEach((item: any) => {
    if (item?.isCompleted == true) {
      checkBoxArray.value[item.id] = item?.isCompleted
    } else {
      checkBoxArray.value[item.id] = item?.isCompleted
    }
  });
});

watch(() => todoObj.todo, (newValue) => {
  const filter = newList.value.data.filter((item: any) => item.todo.includes(newValue));
  if (filter.length <= 0) {
    noResult.value = "No result. Create a new one instead!"
  }

  if (newValue == "") {
    noResult.value = ""
    getTodo();
  } else {
    newList.value.data = filter;
  }

  newList.value.data = filter;
});

const isCompleted = async (item: any) => {
  const data = {
    todo: item.todo,
    isCompleted: checkBoxArray.value[item.id] ? false : true,
    createdAt: new Date().toDateString(),
  }

  await axios
    .put(`api/todoUpdate?id=${item.id}`, data)
    .then((res) => {
      console.log("Response Updated todoObj.todo =>", res.data)
    });
  await getTodo();
};

const updateTodo = async (value: any) => {
  isCheck.value = true;
  todoObj.todo = value.todo
  updateObj.value = value
};
</script>

<template>
  {{ noResult }}
  <div class="m-40">
    <input v-model="todoObj.todo" @keyup.enter="enterValue(todoObj)" />
    <div v-for="item in newList.data">
      <div class="parent">
        <div :class="checkBoxArray[item.id] ? 'text' : ''">
          {{ item.todo }}
        </div>
        <div>
          <button class="button" @click="deleteTodo(item?.id)">x</button>
          <button class="button" @click="updateTodo(item)">edit</button>
          <input
            class="button"
            type="checkbox"
            v-model="checkBoxArray[item.id]"
            @click="isCompleted(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.button {
  visibility: hidden;
  top: 50%;
  background-color: #0a0a23;
  color: #fff;
  border: none;
  border-radius: 10px;
}

.parent {
  display: flex;
  margin-top: 5px;
}

.parent:hover .button {
  margin-left: 10px;
  visibility: visible;
  background-color: #5d5dae;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: small;
  padding: 4px;
}

.text{
  text-decoration: line-through;
}

</style>
