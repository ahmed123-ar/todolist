let tasks_info = []
let items = 0
let edit_index = -1

let body = document.querySelector("body")
let com = document.querySelector(".completed")
let incom = document.querySelector(".incomplete")
let pend = document.querySelector(".pending")
let Ui_btn_add = document.querySelector("#button_add")
let Ui_btn_box = document.querySelector("#main_add_box")
let form_cancel = document.querySelector(".undo")
let form_add = document.querySelector(".add")
let main_task_box = document.querySelector("#main_box_parent")
let form = document.querySelector("form")
let input = document.querySelectorAll("input")
let remove = document.querySelector("#button_re_all")

function delete_tasks(){
    let del_btns = document.querySelectorAll(".del_ui")

    del_btns.forEach(everybtn => {
        everybtn.addEventListener("click" , () => {
            let del_parent = everybtn.parentElement
            let del_class = del_parent.className
            let del_index = +del_class.substring(3)
            tasks_info.splice(del_index,1)
            into_local()
            items = 0
            main_task_box.innerHTML=""
            if(tasks_info.length === 0){
                main_task_box.innerHTML = "no tasks"
            }else{
                display()
                tasks_perc()
                delete_tasks()
                edit_tasks()
            }
            
        })
    })
}

function edit_tasks(){
    let edit_btns = document.querySelectorAll(".edit_ui")

    edit_btns.forEach(btn =>{
        btn.addEventListener("click" , ()=> {
            let parent_edit = btn.parentElement
            let edit_class = parent_edit.className
            edit_index = +edit_class.substring(4)
            console.log(edit_index)

            form.classList.add("form")
            form.classList.remove("remove")
            Ui_btn_box.classList.add("remove")
            main_task_box.classList.add("remove")

            input[0].value = tasks_info[edit_index].task
            input[1].value = tasks_info[edit_index].date
            input[2].value = tasks_info[edit_index].time

        })
    })
}

function display(){
    tasks_info.forEach(task_single => {
    let parent_box = document.createElement("div")
    parent_box.classList.add("main_box")
    main_task_box.appendChild(parent_box)
    let whole_one_task = document.createElement("div")
    whole_one_task.classList.add(`whole_${items}`)
    parent_box.appendChild(whole_one_task)

    let task = document.createElement("span")
    task.classList.add(`task${items}`)
    task.innerText= task_single.task
    whole_one_task.appendChild(task)
    let date = document.createElement("span")
    date.classList.add(`date${items}`)
    if(task_single.date === ""){
        date.innerText = "no date added"
    }else{
        date.innerText= task_single.date
    }
    whole_one_task.appendChild(date)
    let time = document.createElement("span")
    time.classList.add(`time${items}`)
    if (task_single.time === ""){
        time.innerText = "no time added"
    }else{
        time.innerText= task_single.time
    }
    whole_one_task.appendChild(time)
    let del = document.createElement("span")
    del.classList.add(`del${items}`)
    whole_one_task.appendChild(del)

    let del_btn = document.createElement("button")
    del_btn.innerText = "Delete"
    del_btn.classList.add("del_ui")
    del.appendChild(del_btn)

    let edit = document.createElement("span")
    edit.classList.add(`edit${items}`)
    whole_one_task.appendChild(edit)

    let edit_btn = document.createElement("button")
    edit_btn.innerText = "edit"
    edit_btn.classList.add("edit_ui")
    edit.appendChild(edit_btn)

    let complete = document.createElement("span")
    complete.classList.add(`com${items}`)
    whole_one_task.appendChild(complete)

    let com_btn = document.createElement("button")
    com_btn.innerText = "Complete"
    com_btn.classList.add("complete_ui")
    complete.appendChild(com_btn)
    items = items +1
    })
}

function into_local(){
    localStorage.setItem("tasks" , JSON.stringify(tasks_info))
}

function get_local(){
    data = (localStorage.getItem("tasks"))
    if(data){
        return JSON.parse(data)
    }else{
        return []
    }
}

function empt_input(){
    input.forEach(eachinput =>  {
        eachinput.value = ""
    })
}

function all_time(){
    let hours_id=document.querySelector(".hours")
    let min_id=document.querySelector(".min")
    let sec_id=document.querySelector(".sec")
    let full_format_date = new Date()
    let hours = full_format_date.getHours().toString().padStart(2 , "0")
    let min = full_format_date.getMinutes().toString().padStart(2 , "0")
    let sec = full_format_date.getSeconds().toString().padStart(2 , "0")
    hours_id.innerText = hours
    min_id.innerText = min
    sec_id.innerText = sec
}

function  all_date(){
    let date_id=document.querySelector(".date")
    let month_id =document.querySelector(".month")
    let year_id = document.querySelector(".year")
    let full_format_date = new Date()
    let date = full_format_date.getDate().toString().padStart(2 , "0")
    let month =full_format_date.toLocaleString('default', { month: 'short' })
    let year = full_format_date.getFullYear()
    date_id.innerText = date
    month_id.innerText = month
    year_id.innerText  = year
}

function tasks_perc(){
    let pending_perc = ((pending_items/items) *100).toFixed(1)
    let completed_perc = ((completed_items/items)*100).toFixed(1)
    let incomplete_perc = ((incomplted_items/items)*100).toFixed(1)
    com.innerText = completed_perc.toString()
    incom.innerText = incomplete_perc.toString()
    pend.innerText = pending_perc.toString()
}


setInterval(all_date,1000)

setInterval(all_time, 1000)

document.addEventListener("DOMContentLoaded" , () =>  {
    tasks_info = get_local()
    if(tasks_info.length === 0){
        main_task_box.innerText  = "no tasks"
    }else{
        display()
        delete_tasks()
        edit_tasks()
        tasks_perc()
    }
})

form.addEventListener("submit" , (e) => {

    e.preventDefault()

    if (input[0].value === "") {
        alert("enter task")
        return
    }

    let obj = {
        task : input[0].value ,
        date : input[1].value ,
        time : input[2].value ,
        status : "pending"
    }

    if(edit_index === -1){
        tasks_info.push(obj)
    }else{
        tasks_info[edit_index] = obj
        edit_index = -1
    }
    items = 0
    main_task_box.innerHTML = ""
    into_local()
    tasks_info = get_local()
    display()
    delete_tasks()
    edit_tasks()
    empt_input()
    tasks_perc()

    form.classList.add("remove")
    form.classList.remove("form")
    Ui_btn_box.classList.remove("remove")
    main_task_box.classList.remove("remove")
    body.classList.remove("background")


})

Ui_btn_add.addEventListener("click" , () => {
    form.classList.add("form")
    form.classList.remove("remove")
    Ui_btn_box.classList.add("remove")
    main_task_box.classList.add("remove")
    body.classList.add("background")
    body.classList.add("background")
    tasks_perc()
})

form_cancel.addEventListener("click"  , () => {
    form.classList.add("remove")
    form.classList.remove("form")
    Ui_btn_box.classList.remove("remove")
    main_task_box.classList.remove("remove")
    empt_input()
    edit_index = -1
    body.classList.remove("background")

})

remove.addEventListener("click" , () => {
    localStorage.clear()
    tasks_info = []
    main_task_box.innerText  = "no tasks"

})



