import React, { useState } from 'react';

const QuestionModal = ({ showModal, setShowModal, handleAddQuestion, questionTitle, setQuestionTitle, questionContent, setQuestionContent, isAnonymous, setIsAnonymous, userRole }) => {
    
    return (
        <div>
            {showModal && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add a Question</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddQuestion}>
                                    <div className="mb-3">
                                        <label htmlFor="questionTitle" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your question title here"
                                            id="questionTitle"
                                            value={questionTitle}
                                            onChange={(e) => setQuestionTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="questionContent" className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            id="questionContent"
                                            rows="4"
                                            placeholder="Describe your question here"
                                            value={questionContent}
                                            onChange={(e) => setQuestionContent(e.target.value)}
                                            required
                                        />
                                        {/* Anonymity Checkbox */}
                                        {userRole === 'student' && (
                                        <div className="mb-3 form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="anonymousCheck"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="anonymousCheck">
                                                Post as Anonymous
                                            </label>
                                        </div>
                                        )}

                                    </div>
                                    <button type="submit" className="btn btn-primary">Add Question</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionModal;
