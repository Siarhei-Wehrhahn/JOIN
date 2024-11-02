const loadTaskInfos = async () => {
    const todoCount = document.getElementById('todoCountId');
    const doneCount = document.getElementById('doneCountId');
    const urgentCount = document.getElementById('urgentCountId');
    const deadline = document.getElementById('urgentDeadlineId');
    const tasksCount = document.getElementById('taskCountId');
    const progressCount = document.getElementById('progressCountId');
    const awaitingFeedbackCount = document.getElementById('awaitingFeedbackCountId');
    const name = document.getElementById('profileNameId');

    try {
      const taskData = await loadData("/tasks");
      const tasks = Object.values(taskData)
        .filter(task => task.title && task.dueDate && task.area)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      const filterTodoTasks = tasks.filter(task => task.area == "toDo");
      const filterDoneTasks = tasks.filter(task => task.area == "done");
      const filterTasksInProgress = tasks.filter(task => task.area == "progress");
      const filterFeedbackTasks = tasks.filter(task => task.area == "feedback");
      const filterUrgentTasks = tasks.filter(task => task.area == "urgent")
      const mostUrgentTask = tasks.reduce((earliest, currentTask) => {
        return new Date(currentTask.dueDate) < new Date(earliest.dueDate) ? currentTask : earliest;
      }, tasks[0]);

      if (mostUrgentTask) {
        deadline.textContent = new Date(mostUrgentTask.dueDate).toLocaleDateString();
      } else {
        console.log("Keine Aufgaben gefunden.");
      }
      todoCount.innerText = filterTodoTasks.length;
      doneCount.innerText = filterDoneTasks.length;
      urgentCount.innerText = filterUrgentTasks.length;
      tasksCount.innerText = tasks.length;
      progressCount.innerText = filterTasksInProgress.length;
      awaitingFeedbackCount.innerText = filterFeedbackTasks.length;
      name.innerText = currentUser.name

    } catch (error) {
      console.error("Failed to load Tasks in summaryView: " + error);
    }
  }