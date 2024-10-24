// das muss hier nicht rein
function litleTaskTemplate(title, description, completedSubtasks, totalSubtasks, avatars){ 
    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;

    const template = /*html*/`
    <div class="user-story-card">
        <div class="user-story-label">User Story</div>
        <div class="user-story-content">
            <h3 class="story-title">${title}</h3>
            <p class="story-description">${description}</p>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
            </div>
            <span class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</span>
        </div>
        <div class="avatars">
            ${avatars.map(avatar => `<span class="avatar" style="background-color: ${avatar.color};">${avatar.initials}</span>`).join('')}
        </div>
        <div class="menu-icon">
            <!-- menu icon -->
        </div>
    </div>
`;
}
// hier die css

// .user-story-card {
//   width: 250px;
//   background-color: white;
//   border-radius: 10px;
//   padding: 15px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   position: relative;
// }

// .user-story-label {
//   background-color: #1E88E5;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 15px;
//   font-size: 12px;
//   display: inline-block;
// }

// .user-story-content {
//   margin-top: 10px;
// }

// .story-title {
//   font-size: 16px;
//   font-weight: bold;
// }

// .story-description {
//   font-size: 14px;
//   color: #757575;
// }

// .progress-container {
//   margin-top: 15px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

// .progress-bar {
//   width: 70%;
//   height: 8px;
//   background-color: #E0E0E0;
//   border-radius: 5px;
//   overflow: hidden;
// }

// .progress-fill {
//   height: 100%;
//   background-color: #1E88E5;
//   border-radius: 5px;
// }

// .subtasks {
//   font-size: 12px;
//   color: #757575;
// }

// .avatars {
//   margin-top: 10px;
//   display: flex;
//   gap: 5px;
// }

// .avatar {
//   width: 30px;
//   height: 30px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   font-weight: bold;
//   font-size: 12px;
// }

// .menu-icon {
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
// }