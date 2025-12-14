
function handleRequiredAndEnableInputsForFraction(frac_counter) {
  const fractionSelect = document.getElementById(`fraction_analyzed_${frac_counter}`);
  const orgOrMinRadios = document.querySelectorAll(`input[name="orgOrMin_${frac_counter}"]`);
  const sieveSizeInput = document.getElementById(`sieveSize_${frac_counter}`);
  const stdMultiplierInput = document.getElementById(`multiplier_${frac_counter}`);

  fractionSelect.addEventListener('change', () => {
    if (fractionSelect.value !== '') {
      // orgOrMin and sieveSize required
      orgOrMinRadios.forEach(radio => radio.required = true);
      sieveSizeInput.required = true;

      // enable inputs
      orgOrMinRadios.forEach(radio => radio.disabled = false);
      sieveSizeInput.disabled = false;
      stdMultiplierInput.disabled = false;
    }
  });
}

let frac_counter = 1;

function addFraction() {
  frac_counter+=1;  
  html='\
  <div id="one_fraction">\
    <br>\
    <legend>fraction '+frac_counter+':</legend>\
    <div class="row">\
      <div class="col-25">\
        <label for="fraction_analyzed_'+frac_counter+'">fraction analyzed:</label>\
      </div>\
      <div class="col-75">\
        <select id="fraction_analyzed_'+frac_counter+'">\
          <option value="" hidden selected> </option>\
          <option value="yes">yes</option>\
          <option value="no">no</option>\
          <option value="partly">partly</option>\
        </select>\
      </div>\
    </div>\
    <div class="row">\
      <div class="col-25">\
        <label>organic / minerals:</label>\
      </div>\
      <div class="col-75">\
        <div class="form-check form-check-inline">\
          <label class="form-check-label" for="org_'+frac_counter+'">ORG</label>\
          <input class="form-check-input" type="radio" name="orgOrMin_'+frac_counter+'" id="org_'+frac_counter+'" value="org" disabled>\
        </div>\
        <div class="form-check form-check-inline">\
          <label class="form-check-label" for="min_'+frac_counter+'">MIN</label>\
          <input class="form-check-input" type="radio" name="orgOrMin_'+frac_counter+'" id="min_'+frac_counter+'" value="min" disabled>\
        </div>\
      </div>\
    </div>\
    <div class="row">\
      <div class="col-25">\
        <label for="sieveSize">sieve size:</label>\
      </div>\
      <div class="col-75">\
        <input type="number" name="sieveSize" step="0.01" id="sieveSize_'+frac_counter+'" disabled>\
      </div>\
    </div>\
    <div class="row">\
      <div class="col-25"> \
        <label for="multiplier">standard multiplier:</label>\
      </div>\
      <div class="col-75">\
        <input type="number" name="multiplier" step="0.01" id="multiplier_'+frac_counter+'" disabled>\
      </div>\
    </div>\
  </div>'
  var form=document.getElementById('fractions');
  form.insertAdjacentHTML('beforeend',html);
  updateRemoveFractionButtonVisibility()
  handleRequiredAndEnableInputsForFraction(frac_counter);
}

function updateRemoveFractionButtonVisibility() {
  const btn = document.getElementById('removeFractionButton');
  btn.style.display = frac_counter > 0 ? 'inline-block' : 'none';
}

function removeFraction() {
  frac_counter-=1;
  var parent=document.getElementById('fractions')
  parent.lastElementChild.remove();
  updateRemoveFractionButtonVisibility()
}
