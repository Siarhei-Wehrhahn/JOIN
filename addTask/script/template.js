const getEditSubtask = (index) => {
  return /*html*/ `
      <div class="editSubtaskDiv">
        <input type="text" id="editInput">
        <div class="editSubtask">
            <img onclick="deleteSubtask(${index})" class="pointer" src="../assets/icon/delete.svg" alt="">
            <div class="smallLine"></div>
            <svg class="pointer" onclick="saveEditSubtask(${index})" id="checkSubtasks" width="24" height="25" viewBox="0 0 24 25" fill="black" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_191_600" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                <rect y="0.5" width="24" height="24"></rect>
              </mask>
              <g mask="url(#mask0_191_600)">
                <path d="M9.55069 15.65L18.0257 7.175C18.2257 6.975 18.4632 6.875 18.7382 6.875C19.0132 6.875 19.2507 6.975 19.4507 7.175C19.6507 7.375 19.7507 7.6125 19.7507 7.8875C19.7507 8.1625 19.6507 8.4 19.4507 8.6L10.2507 17.8C10.0507 18 9.81736 18.1 9.55069 18.1C9.28403 18.1 9.05069 18 8.85069 17.8L4.5507 13.5C4.3507 13.3 4.25486 13.0625 4.2632 12.7875C4.27153 12.5125 4.3757 12.275 4.5757 12.075C4.7757 11.875 5.0132 11.775 5.2882 11.775C5.5632 11.775 5.80069 11.875 6.00069 12.075L9.55069 15.65Z"></path>
              </g>
            </svg>
          </div>
      </div>
    `;
};