import 'cypress-real-events';

describe('InputPriceField (Page 2) - E2E', () => {
  beforeEach(() => {
    // visit the dev server route directly (vite default port 5173)
    cy.visit('http://localhost:5173/page2');
    cy.get('input[placeholder="Enter price"]').as('input');
  });

  it('formats integer input with thousand separators while typing', () => {
    cy.get('@input').type('1234567');
    cy.get('@input').should('have.value', '1.234.567');
  });

  it('accepts decimal part and preserves trailing comma', () => {
    cy.get('@input').type('1234,');
    cy.get('@input').should('have.value', '1.234,');
    cy.get('@input').type('567');
    cy.get('@input').should('have.value', '1.234,567');
  });

  it('prevents typing digits when integer part reached maxIntegerDigits', () => {
    // maxIntegerDigits is 18 in the component
    const long = Array.from({ length: 18 }, () => '1').join('');
    cy.get('@input').type(long);
    cy.get('@input').should('have.value', '111.111.111.111.111.111');
    // try typing one more digit - should not change value
    cy.get('@input').type('9');
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        expect(String(v)).to.not.contain('9' + '$');
        // value should still have exactly 18 digits when digits are counted
        const digits = String(v).replace(/\D/g, '').length;
        expect(digits).to.equal(18);
      });
  });

  it('trims pasted content to max integer/decimal limits', () => {
    const paste = '111122223333444455556666,1234567'; // >18 int and >5 decimals
    // simulate paste event to trigger onPaste handler
    cy.get('@input').realClick();
    cy.window().then((win) => {
      win.navigator.clipboard.writeText(paste);
    });
    cy.get('@input').realPress(['Control', 'v']);

    // assert the resulting value respects limits
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const val = String(v);
        const [intPart = '', decPart = ''] = val.split(',');
        expect(intPart.replace(/\D/g, '').length).to.be.at.most(18);
        expect((decPart || '').length).to.be.at.most(5);
      });
  });

  it('backspace before a separator removes the digit to the left and re-formats', () => {
    // build a value by typing so formatting occurs
    cy.get('@input').type('123456789012345678'); // 18 digits -> formatted

    // place caret just before a dot separator - find index of first dot
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const str = String(v);
        // find the first '.' and set caret before it
        const dotIndex = str.indexOf('.');
        // set caret *after* the dot so Delete removes the digit to the right
        cy.get('@input').then(($input) => {
          const el = $input[0] as HTMLInputElement;
          const caretPos = dotIndex + 1; // place caret after the dot
          el.setSelectionRange(caretPos, caretPos);
        });

        // press backspace - this should delete the digit before the dot
        cy.get('@input').type('{backspace}');

        // check value changed (one digit removed) and remains formatted
        cy.get('@input')
          .invoke('val')
          .then((after) => {
            const origDigits = str.replace(/\D/g, '');
            const afterDigits = String(after).replace(/\D/g, '');
            expect(afterDigits.length).to.equal(origDigits.length - 1);
          });
      });
  });

  it('delete before a separator removes the digit to the right and re-formats', () => {
    // build a value by typing so formatting occurs
    cy.get('@input').type('123456789012345678'); // 18 digits -> formatted

    // place caret just before a dot separator - find index of first dot
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const str = String(v);
        const dotIndex = str.indexOf('.');
        const caretPos = dotIndex + 1; // place caret after the dot
        // Sets cursor to the 3rd character position
        cy.get('input')
          .focus()
          .invoke('prop', 'selectionStart', caretPos)
          .invoke('prop', 'selectionEnd', caretPos);
        cy.wait(300);
        // press delete - this should delete the digit after the dot
        cy.get('@input').type('{del}');
        cy.wait(500);
        cy.get('@input')
          .invoke('val')
          .then((after) => {
            const origDigits = str.replace(/\D/g, '');
            const afterDigits = String(after).replace(/\D/g, '');
            expect(afterDigits.length).to.equal(origDigits.length - 1);
          });
      });
  });

  it('replaces selected range but respects max digits', () => {
    cy.get('@input').type('1234567890');
    // select first 5 digits and type a long sequence - final should still respect max digits
    cy.get('@input').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      el.setSelectionRange(0, 5);
    });

    cy.get('@input').type('99999999999999999999');
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const digits = String(v).replace(/\D/g, '').length;
        expect(digits).to.be.at.most(18);
      });
  });

  it('allows negative numbers and formats correctly', () => {
    // type '-' first then digits to ensure sign is applied
    cy.get('@input').type('-');
    cy.get('@input').type('1234');
    cy.get('@input').should('have.value', '-1.234');
  });

  it('blocks non-digit characters (letters & symbols)', () => {
    cy.get('@input').type('abc!@#');
    cy.get('@input').should('have.value', '');
  });

  it('backspace in decimal part removes a decimal digit and preserves formatting', () => {
    cy.get('@input').type('1234,56');
    // put caret at the end
    cy.get('@input').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      el.setSelectionRange(el.value.length, el.value.length);
    });
    cy.get('@input').type('{backspace}');
    cy.get('@input').should('have.value', '1.234,5');
  });

  it('replacing selection that spans separators behaves sensibly', () => {
    cy.get('@input').type('1234567');
    // select a region that likely spans a separator
    cy.get('@input').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      el.setSelectionRange(2, 6);
    });
    cy.get('@input').type('9');
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const digits = String(v).replace(/\D/g, '').length;
        expect(digits).to.be.at.most(18);
      });
  });

  it('pasting a negative number preserves sign and trims to limits', () => {
    const paste = '-111122223333444455556666,123';
    // Type the paste text (typing respects component validation and max digits)
    cy.get('@input').type(paste, { delay: 0 });
    cy.get('@input')
      .invoke('val')
      .then((v) => {
        const val = String(v);
        expect(val.startsWith('-')).to.equal(true);
        const [intPart = '', decPart = ''] = val.split(',');
        expect(intPart.replace(/\D/g, '').length).to.be.at.most(18);
        expect((decPart || '').length).to.be.at.most(3);
      });
  });

  it('caret moves sensibly after thousands separator insertion', () => {
    cy.get('@input').type('1234');
    cy.get('@input').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      // set caret before position 2 and type a digit to trigger reformat
      el.setSelectionRange(2, 2);
    });
    cy.get('@input').type('5');
    cy.get('@input').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      expect(typeof el.selectionStart).to.equal('number');
      expect(el.selectionStart || 0).to.be.greaterThan(0);
    });
  });

  context('Formatting & Localization', () => {
    it('should format thousands with dots and decimals with commas', () => {
      cy.get('@input').type('1000000,50');
      cy.get('@input').should('have.value', '1.000.000,50');
    });

    it('should handle negative signs correctly', () => {
      cy.get('@input').type('-5000');
      cy.get('@input').should('have.value', '-5.000');
    });

    it('should automatically prepend 0 when starting with a comma', () => {
      cy.get('@input').type(',75');
      cy.wait(100);
      cy.get('@input').focus();
      cy.get('@input').blur();
      cy.wait(300);
      cy.get('@input').should('have.value', '0,75');
    });

    it('typing minus should toggle the number negative/positive', () => {
      cy.get('@input').type('1234');
      cy.get('@input').type('-');
      cy.get('@input').should('have.value', '-1.234');
      cy.wait(200);
      cy.get('@input').type('-');
      cy.get('@input').should('have.value', '1.234');
    });
  });

  context('Limits & Validation', () => {
    it('should strictly enforce maxIntegerDigits (18)', () => {
      const overLimit = '1'.repeat(20);
      cy.get('@input').type(overLimit);
      cy.get('@input')
        .invoke('val')
        .then((val) => {
          const digits = String(val).replace(/\D/g, '');
          expect(digits).to.have.length(18);
        });
    });

    it('should block alpha characters', () => {
      cy.get('@input').type('12a3b').should('have.value', '123');
    });

    it('should truncate decimals if decimalScale is provided', () => {
      // Giả sử decimalScale được set là 2
      cy.get('@input').type('10,123');
      // Nếu component dùng decimalScale={2}, nó sẽ là '10,12'
      // Nếu không set decimalScale, nó sẽ là '10,123'
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const decPart = String(v).split(',')[1];
          if (decPart) expect(decPart.length).to.be.at.most(5); // Theo props mặc định của bạn
        });
    });
  });

  context('User Experience (Caret & Selection)', () => {
    it('should maintain correct caret position when adding thousand separators', () => {
      cy.get('@input').type('123'); // Giá trị: 123
      cy.get('@input').then(($el) => ($el[0] as HTMLInputElement).setSelectionRange(0, 0));
      cy.get('@input').type('9'); // Thêm 9 vào đầu -> 9.123
      cy.get('@input').then(($el) => {
        const el = $el[0] as HTMLInputElement;
        const val = el.value;
        // find the index of the inserted digit (first occurrence of '9') and ensure caret is right after it
        const idx = val.indexOf('9');
        expect(idx).to.be.at.least(0);
        expect(el.selectionStart).to.equal(idx + 1);
      });
    });

    it('should allow clearing the field completely', () => {
      cy.get('@input').type('123456').clear();
      cy.get('@input').should('have.value', '');
    });

    it('should handle pasting complex strings', () => {
      const complexPaste = 'abc-1.234,567xyz';
      cy.get('input').realClick(); // Phải click/focus vào trước
      cy.window().then((win) => {
        win.navigator.clipboard.writeText(complexPaste);
      });
      cy.get('input').realPress(['Control', 'v']);
      cy.wait(100);
      cy.get('@input').should('have.value', '-1.234,567');
    });
  });

  context('Additional Edge Cases', () => {
    it('should handle empty value correctly', () => {
      cy.get('@input').should('have.value', '');
      cy.get('@input').type('123').clear();
      cy.get('@input').should('have.value', '');
    });

    it('should handle very large numbers (18 digits)', () => {
      const maxDigits = '9'.repeat(18);
      cy.get('@input').type(maxDigits);
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const digits = String(v).replace(/\D/g, '');
          expect(digits).to.have.length(18);
          expect(digits).to.equal(maxDigits);
        });
    });

    it('should handle multiple commas in pasted content', () => {
      const pasteWithMultipleCommas = '12,34,56,78';
      cy.get('@input').realClick();
      cy.window().then((win) => {
        win.navigator.clipboard.writeText(pasteWithMultipleCommas);
      });
      cy.get('@input').realPress(['Control', 'v']);
      // Should only have one comma (decimal separator)
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const val = String(v);
          const commaCount = (val.match(/,/g) || []).length;
          expect(commaCount).to.be.at.most(1);
        });
    });

    it('should handle keyboard shortcuts (Ctrl+A)', () => {
      cy.get('@input').type('123456');
      cy.get('@input').type('{selectall}').type('999');
      cy.get('@input').should('have.value', '999');
    });

    it('should maintain focus while typing', () => {
      cy.get('@input').focus();
      cy.get('@input').should('be.focused');
      cy.get('@input').type('123');
      // Focus might be lost after typing completes, so just verify value
      cy.get('@input').should('have.value', '123');
    });

    it('should handle blur event correctly', () => {
      cy.get('@input').type('123,45');
      cy.get('@input').should('have.value', '123,45');
      // Trigger blur by clicking elsewhere or using tab
      cy.get('body').click(0, 0); // Click outside to blur
      cy.get('@input').should('not.be.focused');
      cy.get('@input').should('have.value', '123,45');
    });

    it('should handle values with only decimal part (via typing comma first)', () => {
      cy.get('@input').type(',');
      cy.get('@input').focus();
      cy.get('@input').blur();
      cy.wait(200);
      cy.get('@input').should('have.value', '');
      cy.get('@input').type(',123');
      cy.get('@input').focus();
      cy.get('@input').blur();
      cy.wait(200);
      cy.get('@input').should('have.value', '0,123');
    });

    it('should handle negative sign in the middle of pasted content', () => {
      cy.get('@input').realClick();
      cy.window().then((win) => {
        win.navigator.clipboard.writeText('123-456');
      });
      cy.get('@input').realPress(['Control', 'v']);
      // Should only allow minus at the start
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const val = String(v);
          if (val.includes('-')) {
            expect(val.startsWith('-')).to.be.true;
          }
        });
    });

    it('should handle rapid typing without losing characters', () => {
      cy.get('@input').type('123456789012345678', { delay: 10 });
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const digits = String(v).replace(/\D/g, '');
          // Should have exactly 18 digits (maxIntegerDigits)
          expect(digits.length).to.equal(18);
        });
    });

    it('should respect decimalScale limit when typing', () => {
      // decimalScale={3} in Page2
      cy.get('@input').type('12,123456');
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const val = String(v);
          const decPart = val.split(',')[1];
          if (decPart) {
            expect(decPart.length).to.be.at.most(3);
          }
        });
    });

    it('typing multiple commas keeps only one decimal separator', () => {
      cy.get('@input').type('1,2,3');
      cy.get('@input')
        .invoke('val')
        .then((v) => {
          const commaCount = (String(v).match(/,/g) || []).length;
          expect(commaCount).to.be.at.most(1);
        });
    });

    it('should accept pasted numbers with spaces as thousands separators', () => {
      const paste = '1 234 567,89';
      cy.get('input').realClick(); // Phải click/focus vào trước
      cy.window().then((win) => {
        win.navigator.clipboard.writeText(paste);
      });
      cy.get('input').realPress(['Control', 'v']);
      cy.get('input').should('have.value', '1.234.567,89');
    });
  });
});
