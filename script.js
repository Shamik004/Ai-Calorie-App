const maxValues = {
            protein: 50,
            carbs: 300,
            fat: 70
        };

        // Handle file upload
        document.getElementById('fileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) await processImage(file);
        });

        // Camera handler
        async function openCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                const preview = document.getElementById('preview');
                preview.innerHTML = '';
                preview.appendChild(video);

                video.addEventListener('click', async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    stream.getTracks().forEach(track => track.stop());
                    
                    const blob = await new Promise(resolve => canvas.toBlob(resolve));
                    await processImage(blob);
                });
            } catch (err) {
                alert('Camera access error: ' + err.message);
            }
        }

        // Process image
        async function processImage(file) {
            try {
                showLoading();
                const preview = document.getElementById('preview');
                const img = document.createElement('img');
                img.className = 'preview-image w-100';
                img.src = URL.createObjectURL(file);
                preview.innerHTML = '';
                preview.appendChild(img);

                // Upload to ImgBB
                const formData = new FormData();
                formData.append('image', file);
                const imgbbResponse =  await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const imgbbData = await imgbbResponse.json();
                const imageUrl = imgbbData.data.url;

                // Call Grok API
                const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                    },
                    body: JSON.stringify({
                        messages: [{
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Give calories of each item in this image in this below JSON format only\n {items:[{item_name:name of item, total_calories:in gm, total_protien:in gm , total_carbs: in gm ,total_fats:in gm},...]}\n and make sure to keep the keys name same as mentioned in the JSON format and do not add any other keys or values in the JSON format. Also, do not add any extra text or explanation. Just give the JSON format as output."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: imageUrl
                                    }
                                }
                            ]
                        }],
                        model: "llama-3.2-90b-vision-preview",
                        temperature: 1,
                        max_completion_tokens: 1024,
                        top_p: 1,
                        stream: false,
                        response_format: {
                            type: "json_object"
                        },
                        stop: null
                    })
                });

                const grokData = await grokResponse.json();
                const items = JSON.parse(grokData.choices[0].message.content).items;
                items.forEach(item => displayCard(item));
                
            } catch (error) {
                alert('Processing error: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        // Display nutrition card
         function displayCard(data) {
            const container = document.getElementById('cardsContainer');
            const protein = data.total_protien ?? 0;
            const carbs = data.total_carbs ?? 0;
            const fat = data.total_fats ?? 0;

            // Calculate percentages
            const proteinPercent = Math.min((protein/maxValues.protein)*100, 100);
            const carbsPercent = Math.min((carbs/maxValues.carbs)*100, 100);
            const fatPercent = Math.min((fat/maxValues.fat)*100, 100);

            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4';
            
            col.innerHTML = `
                <div class="nutri-card p-4 h-100">
                    <div class="d-flex flex-column gap-3">
                        <h4 class="text-center mb-3">${data.item_name || 'Unknown Item'}</h4>
                        <div class="calorie-badge text-center w-100">${data.total_calories ?? 0} kcal</div>
                        
                        <div class="row g-3 mt-3 text-center">
                            <div class="col-4">
                                <div class="nutri-circle protein-circle">
                                    <div class="nutri-value text-info">
                                        ${protein}g
                                        <span class="nutri-percentage">${proteinPercent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="nutri-label">Protein</div>
                            </div>
                            
                            <div class="col-4">
                                <div class="nutri-circle carbs-circle">
                                    <div class="nutri-value text-success">
                                        ${carbs}g
                                        <span class="nutri-percentage">${carbsPercent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="nutri-label">Carbs</div>
                            </div>
                            
                            <div class="col-4">
                                <div class="nutri-circle fat-circle">
                                    <div class="nutri-value text-danger">
                                        ${fat}g
                                        <span class="nutri-percentage">${fatPercent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="nutri-label">Fat</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(col);
        }

        // Loading state
        function showLoading() {
            document.getElementById('loadingSpinner').classList.remove('d-none');
        }

        function hideLoading() {
            document.getElementById('loadingSpinner').classList.add('d-none');
        }