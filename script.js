let tasks_info = []
let items = 0
let edit_index = -1
let today_time=""
let today_date=""

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


function normalize_input_date_time() {
    today_date_time();

    if (!input[1].value && input[2].value) {
        input[1].value = today_date;
    }
}

function percentages_task(){
    const total_tasks=tasks_info.length
    if(total_tasks === 0){
        com.innerText = `0% compl`
        incom.innerText = `0% incom`
        pend.innerText = `0% pend`
        return
    }

    const tasks_pending = tasks_info.filter(task => {
        if (task.status === "pending"){
            return true
        }
    }).length

    const tasks_incom = tasks_info.filter(task => {
        if (task.status === "incomplete"){
            return true
        }
    }).length
    
    const tasks_com = tasks_info.filter(task => {
        if (task.status === "completed"){
            return true
        }
    }).length

    const completedPerc = Math.round((tasks_com / total_tasks) * 100);
    const incompletePerc = Math.round((tasks_incom / total_tasks) * 100);
    const pendingPerc = Math.round((tasks_pending / total_tasks) * 100);

    incom.innerText = `${incompletePerc}%`;
    pend.innerText = `${pendingPerc}%`;
    com.innerText = `${completedPerc}%`

    com.style.setProperty("--percent", completedPerc);
    pend.style.setProperty("--percent", pendingPerc);
    incom.style.setProperty("--percent", incompletePerc);

    

    
}


function today_date_time(){
    let now = new Date()
    let today_hrs = String(now.getHours()).padStart(2, '0')
    let today_min = String(now.getMinutes()).padStart(2, '0')
    today_time = `${today_hrs}:${today_min}`
    let today_year= now.getFullYear()
    let today_month = String(now.getMonth() + 1).padStart(2, '0')
    let today_day = String(now.getDate()).padStart(2, '0')
    today_date = `${today_year}-${today_month}-${today_day}`
}

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
                delete_tasks()
                edit_tasks()
            }
            percentages_task()
            
        })
    })
}

function complete_tasks() {
    let completeBtns = document.querySelectorAll(".complete_ui");

    completeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            let parent = btn.parentElement;
            let className = parent.className; // com0, com1...
            let index = +className.substring(3);
            tasks_info[index].status = "completed"

            into_local();

            items = 0;
            main_task_box.innerHTML = "";

            if (tasks_info.length === 0) {
                main_task_box.innerText = "no tasks";
            } else {
                display();
                delete_tasks();
                edit_tasks();
                complete_tasks();
            }

            percentages_task();
        });
    });
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

            percentages_task()

        })
    })
}

function display(){
    items = 0
    tasks_info.forEach(task_single => {
    let parent_box = document.createElement("div")
    parent_box.classList.add("main_box")
    main_task_box.appendChild(parent_box)
    let whole_one_task = document.createElement("div")
    whole_one_task.classList.add(`whole_${items}`)
    parent_box.appendChild(whole_one_task)
    
    if(task_single.status === "pending"){
        parent_box.classList.add("pending")
    }else if(task_single.status === "incomplete"){
        parent_box.classList.add("incomplete")
    }else{
        parent_box.classList.add("complete")
    }

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

    if (task_single.status === "completed") {
    com_btn.disabled = true;
    del_btn.disabled = true;
    edit_btn.disabled = true;

    com_btn.style.opacity = "0.4";
    del_btn.style.opacity = "0.4";
    edit_btn.style.opacity = "0.4";

    com_btn.style.cursor = "not-allowed";
    del_btn.style.cursor = "not-allowed";
    edit_btn.style.cursor = "not-allowed";
}
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

function check_task_status(task){
    if(task.date === ""){
        return "pending"
    }

    today_date_time()

    if(task.date<today_date){
        return "incomplete"
    }else if(task.date===today_date){
        if (!task.time) {
            return "pending"
        }else if (task.time < today_time) {
            return "incomplete"
        }else{
            return "pending"
        }
    }else{
        return  "pending"
    }
}

function update_task_status() {
    today_date_time();

    let changed = false;

    tasks_info.forEach(task => {
        if (task.status === "completed") return
        let newStatus = check_task_status(task);
        if (task.status !== newStatus) {
            task.status = newStatus;
            changed = true;
        }
    });

    if (changed === true) {
        into_local();
        items = 0;
        main_task_box.innerHTML = "";
        display()
        complete_tasks()
        percentages_task()
        delete_tasks()
        edit_tasks()
        complete_tasks()
    }
}


function task_status_input(){
    today_date_time()
    if(input[2].value==="" && input[1].value === ""){
        return "pending"
    }else if (today_date>=input[1].value){
        return "incomplete"
    }else if(today_date === input[1].value){
        if(today_time > input[2].value){
            return "incomplete"
        }else{
            return "pending"
        }
    }else {
        return "pending"
    }


}

setInterval(all_date,1000)

setInterval(all_time, 1000)

setInterval(update_task_status, 1000);

document.addEventListener("DOMContentLoaded" , () =>  {
    tasks_info = get_local()
    if(tasks_info.length === 0){
        main_task_box.innerText  = "no tasks"
        percentages_task()
    }else{
        display()
        complete_tasks()
        percentages_task()
        delete_tasks()
        edit_tasks()
    }
})

form.addEventListener("submit" , (e) => {

    e.preventDefault()

    if (input[0].value === "") {
        alert("enter task")
        return
    }

    normalize_input_date_time()

    let obj = {
        task : input[0].value ,
        date : input[1].value ,
        time : input[2].value ,
        status : task_status_input()
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
    complete_tasks()
    percentages_task()
    delete_tasks()
    edit_tasks()
    empt_input()

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
    percentages_task()

})



