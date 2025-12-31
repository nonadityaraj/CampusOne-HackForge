// Initialize Supabase client
let supabase;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create Supabase client
        supabase = window.supabase.createClient('https://mrhiunezrlxjpulbgavo.supabase.co', 'sb_publishable_zN_jqhsO_dshcyA0Q7Dg4Q_0pmloQeK');
        
        // Check connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            document.getElementById('status').textContent = '⚠️ Connection issue: ' + error.message;
            document.getElementById('status').style.color = 'red';
        } else {
            document.getElementById('status').textContent = '✅ Supabase connected successfully!';
            document.getElementById('status').style.color = 'green';
        }
        
        // Check if user is already logged in
        checkAuthStatus();
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event);
            checkAuthStatus();
        });
        
    } catch (err) {
        // console.error('Initialization error:', err);
        // document.getElementById('status').textContent = '❌ Failed to initialize: ' + err.message;
        // document.getElementById('status').style.color = 'red';
    }
});

// Check authentication status
async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        document.getElementById('authStatus').textContent = 
            `✅ Logged in as: ${session.user.email}`;
    } else {
        document.getElementById('authStatus').textContent = '❌ Not authenticated';
    }
}

// Example: Fetch data from a table
async function fetchData() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Loading...</p>';
    
    try {
        // Example query - replace 'your_table_name' with your actual table
        // This will fail if the table doesn't exist, which is expected in a demo
        const { data, error } = await supabase
            .from('your_table_name')
            .select('*')
            .limit(5);
        
        if (error) {
            resultDiv.innerHTML = `
                <div style="color: orange;">
                    <p><strong>Info:</strong> No table found (this is expected for a new project)</p>
                    <p>Create a table in your Supabase dashboard first!</p>
                    <p style="font-size: 0.9em;">Error: ${error.message}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <h3>Data Retrieved:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        }
    } catch (err) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    }
}

// Example: Sign in with Google OAuth
async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) {
            alert('Sign in error: ' + error.message);
            console.error('Sign in error:', error);
        }
    } catch (err) {
        alert('Sign in failed: ' + err.message);
        console.error('Sign in failed:', err);
    }
}

// Example: Sign out
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            alert('Sign out error: ' + error.message);
        } else {
            alert('Signed out successfully!');
        }
    } catch (err) {
        alert('Sign out failed: ' + err.message);
    }
}

// Example: Insert data
async function insertData(tableName, data) {
    const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([data])
        .select();
    
    if (error) {
        console.error('Insert error:', error);
        return { success: false, error };
    }
    
    return { success: true, data: insertedData };
}

// Example: Update data
async function updateData(tableName, id, updates) {
    const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select();
    
    if (error) {
        console.error('Update error:', error);
        return { success: false, error };
    }
    
    return { success: true, data };
}

// Example: Delete data
async function deleteData(tableName, id) {
    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Delete error:', error);
        return { success: false, error };
    }
    
    return { success: true };
}







// Upload file to Supabase Storage
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');
    console.log('function called')
    if (!fileInput.files || fileInput.files.length === 0) {
        uploadResult.innerHTML = '<p style="color: red;">Please select a file first!</p>';
        return;
    }
    
    // Clear previous results
    uploadProgress.innerHTML = '';
    uploadResult.innerHTML = '';
    
    const files = Array.from(fileInput.files);
    const bucketName = 'campusone'; // Change this to your bucket name
    
    uploadProgress.innerHTML = `<p>Uploading ${files.length} file(s)...</p>`;
    
    try {
        const results = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Generate unique filename with timestamp
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;
            
            uploadProgress.innerHTML += `<p>Uploading ${file.name}... (${i + 1}/${files.length})</p>`;
            
            // Upload file
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (error) {
                results.push({ 
                    name: file.name, 
                    success: false, 
                    error: error.message 
                });
            } else {
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                
                results.push({ 
                    name: file.name, 
                    success: true, 
                    path: data.path,
                    url: urlData.publicUrl
                });
            }
        }
        
        // Display results
        displayUploadResults(results);
        
        // Clear file input
        fileInput.value = '';
        
        // Refresh file list
        listFiles();
        
    } catch (err) {
        uploadResult.innerHTML = `<p style="color: red;">Upload failed: ${err.message}</p>`;
        console.error('Upload error:', err);
    }
}

// Display upload results
function displayUploadResults(results) {
    const uploadResult = document.getElementById('uploadResult');
    const uploadProgress = document.getElementById('uploadProgress');
    
    uploadProgress.innerHTML = '';
    
    let html = '<div class="upload-results">';
    
    results.forEach(result => {
        if (result.success) {
            html += `
                <div class="result-item success">
                    <p><strong>✅ ${result.name}</strong></p>
                    <p style="font-size: 0.9em; color: #666;">Path: ${result.path}</p>
                    <a href="${result.url}" target="_blank" style="font-size: 0.9em;">View File</a>
                </div>
            `;
        } else {
            html += `
                <div class="result-item error">
                    <p><strong>❌ ${result.name}</strong></p>
                    <p style="font-size: 0.9em; color: red;">Error: ${result.error}</p>
                </div>
            `;
        }
    });
    
    html += '</div>';
    uploadResult.innerHTML = html;
}













// List all files in the bucket
async function listFiles() {
    const filesList = document.getElementById('filesList');
    const bucketName = 'uploads'; // Change this to your bucket name
    
    filesList.innerHTML = '<p>Loading files...</p>';
    
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });
        
        if (error) {
            filesList.innerHTML = `
                <div style="color: orange;">
                    <p><strong>Info:</strong> Could not list files</p>
                    <p style="font-size: 0.9em;">Make sure you have created a bucket named "uploads" in Supabase Storage!</p>
                    <p style="font-size: 0.9em;">Error: ${error.message}</p>
                </div>
            `;
            return;
        }
        
        if (!data || data.length === 0) {
            filesList.innerHTML = '<p>No files uploaded yet.</p>';
            return;
        }
        
        // Display files
        let html = '<div class="files-grid">';
        
        data.forEach(file => {
            if (file.name) { // Skip folders
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(file.name);
                
                const fileSize = (file.metadata?.size / 1024).toFixed(2); // Convert to KB
                const fileType = file.metadata?.mimetype || 'unknown';
                const isImage = fileType.startsWith('image/');
                
                html += `
                    <div class="file-item">
                        ${isImage ? `<img src="${urlData.publicUrl}" alt="${file.name}" class="file-preview">` : '<div class="file-icon">📄</div>'}
                        <div class="file-info">
                            <p class="file-name">${file.name}</p>
                            <p class="file-meta">${fileSize} KB</p>
                            <div class="file-actions">
                                <button onclick="downloadFile('${file.name}')">Download</button>
                                <button onclick="deleteFile('${file.name}')" class="delete-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        filesList.innerHTML = html;
        
    } catch (err) {
        filesList.innerHTML = `<p style="color: red;">Error listing files: ${err.message}</p>`;
        console.error('List files error:', err);
    }
}

// Download a file
async function downloadFile(fileName) {
    const bucketName = 'uploads';
    
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .download(fileName);
        
        if (error) {
            alert('Download error: ' + error.message);
            return;
        }
        
        // Create a download link
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch (err) {
        alert('Download failed: ' + err.message);
        console.error('Download error:', err);
    }
}

// Delete a file
async function deleteFile(fileName) {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
        return;
    }
    
    const bucketName = 'uploads';
    
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);
        
        if (error) {
            alert('Delete error: ' + error.message);
            return;
        }
        
        alert('File deleted successfully!');
        listFiles(); // Refresh the list
        
    } catch (err) {
        alert('Delete failed: ' + err.message);
        console.error('Delete error:', err);
    }
}

// Get signed URL for private files (valid for limited time)
async function getSignedUrl(fileName, expiresIn = 3600) {
    const bucketName = 'uploads';
    
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileName, expiresIn);
        
        if (error) {
            console.error('Signed URL error:', error);
            return null;
        }
        
        return data.signedUrl;
        
    } catch (err) {
        console.error('Signed URL error:', err);
        return null;
    }
}


